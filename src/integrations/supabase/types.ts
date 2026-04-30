export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      addresses: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          country: string | null
          created_at: string
          id: string
          order_id: string
          state: string | null
          type: string
          zip: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          order_id: string
          state?: string | null
          type?: string
          zip?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          id?: string
          order_id?: string
          state?: string | null
          type?: string
          zip?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "addresses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_notes: {
        Row: {
          author_id: string
          created_at: string
          id: string
          note: string
          order_id: string
        }
        Insert: {
          author_id: string
          created_at?: string
          id?: string
          note: string
          order_id: string
        }
        Update: {
          author_id?: string
          created_at?: string
          id?: string
          note?: string
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      agreements: {
        Row: {
          id: string
          ip_address: string | null
          order_id: string
          privacy_accepted: boolean | null
          terms_accepted: boolean | null
          timestamp: string
        }
        Insert: {
          id?: string
          ip_address?: string | null
          order_id: string
          privacy_accepted?: boolean | null
          terms_accepted?: boolean | null
          timestamp?: string
        }
        Update: {
          id?: string
          ip_address?: string | null
          order_id?: string
          privacy_accepted?: boolean | null
          terms_accepted?: boolean | null
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "agreements_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      business_applications: {
        Row: {
          application_data: Json
          business_name: string
          business_type: string
          created_at: string
          id: string
          state: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          application_data?: Json
          business_name: string
          business_type: string
          created_at?: string
          id?: string
          state: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          application_data?: Json
          business_name?: string
          business_type?: string
          created_at?: string
          id?: string
          state?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      business_information: {
        Row: {
          alternate_company_name: string | null
          business_description: string | null
          business_purpose: string | null
          company_name: string | null
          created_at: string
          delayed_filing: boolean | null
          id: string
          order_id: string
          organizer_type: string | null
        }
        Insert: {
          alternate_company_name?: string | null
          business_description?: string | null
          business_purpose?: string | null
          company_name?: string | null
          created_at?: string
          delayed_filing?: boolean | null
          id?: string
          order_id: string
          organizer_type?: string | null
        }
        Update: {
          alternate_company_name?: string | null
          business_description?: string | null
          business_purpose?: string | null
          company_name?: string | null
          created_at?: string
          delayed_filing?: boolean | null
          id?: string
          order_id?: string
          organizer_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_information_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      click_analytics: {
        Row: {
          button_label: string
          button_type: string
          clicked_at: string
          destination_url: string
          id: string
          page_location: string
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          button_label: string
          button_type: string
          clicked_at?: string
          destination_url: string
          id?: string
          page_location: string
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          button_label?: string
          button_type?: string
          clicked_at?: string
          destination_url?: string
          id?: string
          page_location?: string
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      company_management: {
        Row: {
          created_at: string
          id: string
          management_type: string | null
          order_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          management_type?: string | null
          order_id: string
        }
        Update: {
          created_at?: string
          id?: string
          management_type?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_management_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      contact_information: {
        Row: {
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          order_id: string
          phone: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id: string
          phone?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id?: string
          phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contact_information_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          document_type: string
          file_url: string
          id: string
          order_id: string
          uploaded_at: string
        }
        Insert: {
          document_type: string
          file_url: string
          id?: string
          order_id: string
          uploaded_at?: string
        }
        Update: {
          document_type?: string
          file_url?: string
          id?: string
          order_id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      email_list: {
        Row: {
          business_type: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          source: string
          updated_at: string
        }
        Insert: {
          business_type?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          source?: string
          updated_at?: string
        }
        Update: {
          business_type?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          source?: string
          updated_at?: string
        }
        Relationships: []
      }
      feedback: {
        Row: {
          category: string
          created_at: string
          id: string
          message: string | null
          page_visited: string
          rating: number
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          category?: string
          created_at?: string
          id?: string
          message?: string | null
          page_visited: string
          rating: number
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          message?: string | null
          page_visited?: string
          rating?: number
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      heatmap_analytics: {
        Row: {
          created_at: string | null
          element_label: string | null
          element_type: string
          id: string
          interaction_type: string
          page_location: string
          position_x: number | null
          position_y: number | null
          session_id: string | null
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          element_label?: string | null
          element_type: string
          id?: string
          interaction_type: string
          page_location: string
          position_x?: number | null
          position_y?: number | null
          session_id?: string | null
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          element_label?: string | null
          element_type?: string
          id?: string
          interaction_type?: string
          page_location?: string
          position_x?: number | null
          position_y?: number | null
          session_id?: string | null
          user_agent?: string | null
        }
        Relationships: []
      }
      irs_responsible_party: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          order_id: string
          phone: string | null
          ssn_encrypted: string | null
          title: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id: string
          phone?: string | null
          ssn_encrypted?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id?: string
          phone?: string | null
          ssn_encrypted?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "irs_responsible_party_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      order_events: {
        Row: {
          actor: string | null
          created_at: string | null
          event_type: string
          id: string
          metadata: Json | null
          order_id: string
        }
        Insert: {
          actor?: string | null
          created_at?: string | null
          event_type: string
          id?: string
          metadata?: Json | null
          order_id: string
        }
        Update: {
          actor?: string | null
          created_at?: string | null
          event_type?: string
          id?: string
          metadata?: Json | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_events_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          application_id: string | null
          created_at: string | null
          ein_service: boolean | null
          email: string | null
          entity_type: string | null
          filing_speed: string | null
          id: string
          package: string | null
          package_id: string | null
          state: string | null
          state_fee: number | null
          status: string | null
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          total_amount: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          application_id?: string | null
          created_at?: string | null
          ein_service?: boolean | null
          email?: string | null
          entity_type?: string | null
          filing_speed?: string | null
          id?: string
          package?: string | null
          package_id?: string | null
          state?: string | null
          state_fee?: number | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          application_id?: string | null
          created_at?: string | null
          ein_service?: boolean | null
          email?: string | null
          entity_type?: string | null
          filing_speed?: string | null
          id?: string
          package?: string | null
          package_id?: string | null
          state?: string | null
          state_fee?: number | null
          status?: string | null
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          total_amount?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      participants: {
        Row: {
          address: string | null
          authorized_signer: boolean | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          order_id: string
          ownership_percent: number | null
          role: string | null
          title: string | null
        }
        Insert: {
          address?: string | null
          authorized_signer?: boolean | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id: string
          ownership_percent?: number | null
          role?: string | null
          title?: string | null
        }
        Update: {
          address?: string | null
          authorized_signer?: boolean | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          order_id?: string
          ownership_percent?: number | null
          role?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "participants_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          order_id: string
          status: string | null
          stripe_payment_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          order_id: string
          status?: string | null
          stripe_payment_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          order_id?: string
          status?: string | null
          stripe_payment_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      registered_agent: {
        Row: {
          address: string | null
          agent_type: string | null
          created_at: string
          id: string
          name: string | null
          order_id: string
        }
        Insert: {
          address?: string | null
          agent_type?: string | null
          created_at?: string
          id?: string
          name?: string | null
          order_id: string
        }
        Update: {
          address?: string | null
          agent_type?: string | null
          created_at?: string
          id?: string
          name?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "registered_agent_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      scroll_analytics: {
        Row: {
          created_at: string | null
          id: string
          max_scroll_reached: number
          page_location: string
          scroll_depth: number
          session_id: string | null
          time_on_page: number
          user_agent: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          max_scroll_reached: number
          page_location: string
          scroll_depth: number
          session_id?: string | null
          time_on_page: number
          user_agent?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          max_scroll_reached?: number
          page_location?: string
          scroll_depth?: number
          session_id?: string | null
          time_on_page?: number
          user_agent?: string | null
        }
        Relationships: []
      }
      social_diagnostics_runs: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          report: Json
          url: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          report: Json
          url: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          report?: Json
          url?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
