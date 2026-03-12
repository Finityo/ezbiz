import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

// ──── Types ────
export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface BusinessInfo {
  companyName: string;
  alternateCompanyName: string;
  businessDescription: string;
  organizerType: string;
  businessPurpose: string;
  delayedFiling: boolean;
}

export interface Address {
  type: "business" | "shipping";
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface RegisteredAgent {
  agentType: "corpnet" | "custom";
  name: string;
  address: string;
}

export interface Participant {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  title: string;
  ownershipPercent: number;
  address: string;
  authorizedSigner: boolean;
}

export interface IrsResponsibleParty {
  firstName: string;
  lastName: string;
  ssn: string;
  phone: string;
  title: string;
}

export interface AgreementsData {
  termsAccepted: boolean;
  privacyAccepted: boolean;
}

export interface OrderState {
  orderId: string | null;
  state: string;
  entityType: string;
  packageId: string;
  selectedAddOns: string[];
  addonQuantities: Record<string, number>;
  contact: ContactInfo;
  business: BusinessInfo;
  businessAddress: Address;
  shippingAddress: Address;
  registeredAgent: RegisteredAgent;
  managementType: string;
  participants: Participant[];
  irsParty: IrsResponsibleParty;
  agreements: AgreementsData;
}

const emptyAddress = (type: "business" | "shipping"): Address => ({
  type,
  address1: "",
  address2: "",
  city: "",
  state: "",
  zip: "",
  country: "US",
});

export const initialOrderState: OrderState = {
  orderId: null,
  state: "",
  entityType: "llc",
  packageId: "",
  selectedAddOns: [],
  addonQuantities: {},
  contact: { firstName: "", lastName: "", email: "", phone: "" },
  business: {
    companyName: "",
    alternateCompanyName: "",
    businessDescription: "",
    organizerType: "",
    businessPurpose: "",
    delayedFiling: false,
  },
  businessAddress: emptyAddress("business"),
  shippingAddress: emptyAddress("shipping"),
  registeredAgent: { agentType: "corpnet", name: "", address: "" },
  managementType: "member_managed",
  participants: [],
  irsParty: { firstName: "", lastName: "", ssn: "", phone: "", title: "" },
  agreements: { termsAccepted: false, privacyAccepted: false },
};

interface OrderContextValue {
  order: OrderState;
  setOrder: React.Dispatch<React.SetStateAction<OrderState>>;
  updateField: <K extends keyof OrderState>(key: K, value: OrderState[K]) => void;
  saving: boolean;
  saveStep: (step: number) => Promise<void>;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export const useOrderContext = () => {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error("useOrderContext must be used within OrderProvider");
  return ctx;
};

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderState>(initialOrderState);
  const [saving, setSaving] = useState(false);

  const updateField = useCallback(<K extends keyof OrderState>(key: K, value: OrderState[K]) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
  }, []);

  const ensureOrder = async (): Promise<string | null> => {
    if (order.orderId) return order.orderId;
    if (!user) return null;

    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        state: order.state || null,
        entity_type: order.entityType || null,
        package: order.packageId || null,
        status: "draft",
        email: user.email,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create order:", error);
      return null;
    }

    const id = data.id;
    setOrder((prev) => ({ ...prev, orderId: id }));
    return id;
  };

  const saveStep = useCallback(
    async (step: number) => {
      if (!user) {
        toast.error("Please log in to save your progress.");
        return;
      }
      setSaving(true);

      try {
        const orderId = order.orderId || (await ensureOrder());
        if (!orderId) throw new Error("Failed to create order record");

        // Update the order base fields
        await supabase
          .from("orders")
          .update({
            state: order.state || null,
            entity_type: order.entityType || null,
            package: order.packageId || null,
          })
          .eq("id", orderId);

        if (step >= 1) {
          // Contact
          await supabase.from("contact_information").upsert(
            {
              order_id: orderId,
              first_name: order.contact.firstName,
              last_name: order.contact.lastName,
              email: order.contact.email,
              phone: order.contact.phone,
            },
            { onConflict: "order_id" }
          );

          // Business info
          await supabase.from("business_information").upsert(
            {
              order_id: orderId,
              company_name: order.business.companyName,
              alternate_company_name: order.business.alternateCompanyName,
              business_description: order.business.businessDescription,
              organizer_type: order.business.organizerType,
              business_purpose: order.business.businessPurpose,
              delayed_filing: order.business.delayedFiling,
            },
            { onConflict: "order_id" }
          );

          // Addresses
          for (const addr of [order.businessAddress, order.shippingAddress]) {
            await supabase.from("addresses").upsert(
              {
                order_id: orderId,
                type: addr.type,
                address1: addr.address1,
                address2: addr.address2,
                city: addr.city,
                state: addr.state,
                zip: addr.zip,
                country: addr.country,
              },
              { onConflict: "order_id,type" as any }
            );
          }

          // Registered agent
          await supabase.from("registered_agent").upsert(
            {
              order_id: orderId,
              agent_type: order.registeredAgent.agentType,
              name: order.registeredAgent.name,
              address: order.registeredAgent.address,
            },
            { onConflict: "order_id" }
          );

          // Management
          await supabase.from("company_management").upsert(
            {
              order_id: orderId,
              management_type: order.managementType,
            },
            { onConflict: "order_id" }
          );

          // Participants — delete existing and reinsert
          await supabase.from("participants").delete().eq("order_id", orderId);
          if (order.participants.length > 0) {
            await supabase.from("participants").insert(
              order.participants.map((p) => ({
                order_id: orderId,
                first_name: p.firstName,
                last_name: p.lastName,
                role: p.role,
                title: p.title,
                ownership_percent: p.ownershipPercent,
                address: p.address,
                authorized_signer: p.authorizedSigner,
              }))
            );
          }
        }

        if (step >= 2) {
          // IRS Responsible Party — encrypt SSN via edge function
          let encryptedSsn = "";
          if (order.irsParty.ssn) {
            const { data: encData } = await supabase.functions.invoke("encrypt-ssn", {
              body: { ssn: order.irsParty.ssn },
            });
            encryptedSsn = encData?.encrypted || "";
          }

          await supabase.from("irs_responsible_party").upsert(
            {
              order_id: orderId,
              first_name: order.irsParty.firstName,
              last_name: order.irsParty.lastName,
              ssn_encrypted: encryptedSsn,
              phone: order.irsParty.phone,
              title: order.irsParty.title,
            },
            { onConflict: "order_id" }
          );
        }

        if (step >= 3) {
          await supabase.from("agreements").upsert(
            {
              order_id: orderId,
              terms_accepted: order.agreements.termsAccepted,
              privacy_accepted: order.agreements.privacyAccepted,
              ip_address: null, // will be set server-side if needed
            },
            { onConflict: "order_id" }
          );
        }

        toast.success("Progress saved");
      } catch (err: any) {
        console.error("Save error:", err);
        toast.error("Failed to save. Please try again.");
      } finally {
        setSaving(false);
      }
    },
    [order, user]
  );

  return (
    <OrderContext.Provider value={{ order, setOrder, updateField, saving, saveStep }}>
      {children}
    </OrderContext.Provider>
  );
};
