import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ApplicationQuickEditDialog from "./ApplicationQuickEditDialog";

// --- Mocks ---------------------------------------------------------------

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

type Row = {
  business_name: string;
  application_data: {
    order_id?: string;
    businessDetails?: Record<string, string>;
  };
};

const APP_ID = "app-1";
const ORDER_ID = "order-1";

let appRow: Row;
const updateCalls: Record<string, any[]> = {
  business_applications: [],
  business_information: [],
  contact_information: [],
};
const insertedEvents: any[] = [];

function makeSelectBuilder(table: string) {
  return {
    select: (_cols: string) => ({
      eq: (_col: string, _val: string) => ({
        maybeSingle: async () => {
          if (table === "business_applications") {
            return { data: appRow, error: null };
          }
          return { data: null, error: null };
        },
      }),
    }),
    update: (patch: any) => {
      updateCalls[table]?.push(patch);
      // mirror to local fixture for business_applications
      if (table === "business_applications") {
        appRow = { ...appRow, ...patch };
      }
      return {
        eq: async (_col: string, _val: string) => ({ data: null, error: null }),
      };
    },
    insert: async (row: any) => {
      if (table === "order_events") insertedEvents.push(row);
      return { data: null, error: null };
    },
  };
}

vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    from: (table: string) => makeSelectBuilder(table),
  },
}));

// --- Tests ---------------------------------------------------------------

describe("ApplicationQuickEditDialog", () => {
  beforeEach(() => {
    appRow = {
      business_name: "Old Name LLC",
      application_data: {
        order_id: ORDER_ID,
        businessDetails: {
          contactFirstName: "Old",
          contactLastName: "User",
          contactEmail: "old@example.com",
          contactPhone: "111-111-1111",
        },
      },
    };
    updateCalls.business_applications = [];
    updateCalls.business_information = [];
    updateCalls.contact_information = [];
    insertedEvents.length = 0;
  });

  it("loads existing values, saves edits, syncs linked order tables, logs event, and calls onSaved", async () => {
    const onSaved = vi.fn();
    const onOpenChange = vi.fn();

    render(
      <ApplicationQuickEditDialog
        open={true}
        onOpenChange={onOpenChange}
        applicationId={APP_ID}
        onSaved={onSaved}
      />,
    );

    // Wait for load
    const bizInput = await screen.findByDisplayValue("Old Name LLC");
    expect(bizInput).toBeInTheDocument();
    expect(screen.getByDisplayValue("old@example.com")).toBeInTheDocument();

    // Edit fields
    fireEvent.change(bizInput, { target: { value: "New Name LLC" } });
    fireEvent.change(screen.getByDisplayValue("Old"), {
      target: { value: "Jane" },
    });
    fireEvent.change(screen.getByDisplayValue("User"), {
      target: { value: "Doe" },
    });
    fireEvent.change(screen.getByDisplayValue("old@example.com"), {
      target: { value: "jane@example.com" },
    });
    fireEvent.change(screen.getByDisplayValue("111-111-1111"), {
      target: { value: "222-222-2222" },
    });

    // Save
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1));

    // business_applications updated with merged data
    expect(updateCalls.business_applications).toHaveLength(1);
    const baPatch = updateCalls.business_applications[0];
    expect(baPatch.business_name).toBe("New Name LLC");
    expect(baPatch.application_data.businessDetails).toMatchObject({
      contactFirstName: "Jane",
      contactLastName: "Doe",
      contactEmail: "jane@example.com",
      contactPhone: "222-222-2222",
    });

    // Linked order tables synced
    expect(updateCalls.business_information).toEqual([
      { company_name: "New Name LLC" },
    ]);
    expect(updateCalls.contact_information).toEqual([
      {
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone: "222-222-2222",
      },
    ]);

    // Audit event logged
    expect(insertedEvents).toHaveLength(1);
    expect(insertedEvents[0]).toMatchObject({
      order_id: ORDER_ID,
      event_type: "admin_edit_application",
      actor: "admin",
    });

    // Dialog closed
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("does not sync to order tables when application has no linked order_id", async () => {
    appRow.application_data.order_id = undefined;

    render(
      <ApplicationQuickEditDialog
        open={true}
        onOpenChange={vi.fn()}
        applicationId={APP_ID}
        onSaved={vi.fn()}
      />,
    );

    const bizInput = await screen.findByDisplayValue("Old Name LLC");
    fireEvent.change(bizInput, { target: { value: "Solo LLC" } });
    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() =>
      expect(updateCalls.business_applications).toHaveLength(1),
    );
    expect(updateCalls.business_information).toHaveLength(0);
    expect(updateCalls.contact_information).toHaveLength(0);
    expect(insertedEvents).toHaveLength(0);
  });
});
