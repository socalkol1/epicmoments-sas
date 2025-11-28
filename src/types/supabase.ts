/**
 * Supabase Database Types
 *
 * This file will be auto-generated after running:
 * supabase gen types typescript --local > src/types/supabase.ts
 *
 * For now, this provides the base structure for development.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          custom_domain: string | null;
          logo_url: string | null;
          primary_color: string;
          subscription_plan: 'free' | 'pro' | 'studio' | 'enterprise';
          subscription_status: 'active' | 'past_due' | 'cancelled' | 'suspended';
          stripe_account_id: string | null;
          stripe_subscription_id: string | null;
          storage_used_bytes: number;
          settings: Json;
          features: Json;
          owner_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          custom_domain?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          subscription_plan?: 'free' | 'pro' | 'studio' | 'enterprise';
          subscription_status?: 'active' | 'past_due' | 'cancelled' | 'suspended';
          stripe_account_id?: string | null;
          stripe_subscription_id?: string | null;
          storage_used_bytes?: number;
          settings?: Json;
          features?: Json;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          custom_domain?: string | null;
          logo_url?: string | null;
          primary_color?: string;
          subscription_plan?: 'free' | 'pro' | 'studio' | 'enterprise';
          subscription_status?: 'active' | 'past_due' | 'cancelled' | 'suspended';
          stripe_account_id?: string | null;
          stripe_subscription_id?: string | null;
          storage_used_bytes?: number;
          settings?: Json;
          features?: Json;
          owner_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string | null;
          email: string;
          full_name: string | null;
          phone: string | null;
          role: 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff' | 'client';
          stripe_customer_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tenant_id?: string | null;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff' | 'client';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string | null;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          role?: 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff' | 'client';
          stripe_customer_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      albums: {
        Row: {
          id: string;
          tenant_id: string;
          event_id: string | null;
          client_id: string | null;
          title: string;
          description: string | null;
          status: 'draft' | 'processing' | 'proofing' | 'ready' | 'delivered';
          cover_image_key: string | null;
          image_count: number;
          total_size_bytes: number;
          delivered_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          event_id?: string | null;
          client_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'draft' | 'processing' | 'proofing' | 'ready' | 'delivered';
          cover_image_key?: string | null;
          image_count?: number;
          total_size_bytes?: number;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          event_id?: string | null;
          client_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'draft' | 'processing' | 'proofing' | 'ready' | 'delivered';
          cover_image_key?: string | null;
          image_count?: number;
          total_size_bytes?: number;
          delivered_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      images: {
        Row: {
          id: string;
          tenant_id: string;
          album_id: string;
          storage_key: string;
          thumbnail_key: string | null;
          watermarked_key: string | null;
          original_filename: string | null;
          width: number | null;
          height: number | null;
          size_bytes: number | null;
          is_portfolio: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          album_id: string;
          storage_key: string;
          thumbnail_key?: string | null;
          watermarked_key?: string | null;
          original_filename?: string | null;
          width?: number | null;
          height?: number | null;
          size_bytes?: number | null;
          is_portfolio?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          album_id?: string;
          storage_key?: string;
          thumbnail_key?: string | null;
          watermarked_key?: string | null;
          original_filename?: string | null;
          width?: number | null;
          height?: number | null;
          size_bytes?: number | null;
          is_portfolio?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          description: string | null;
          price_cents: number;
          product_type: 'package' | 'template' | 'print' | 'addon';
          image_count: number | null;
          stripe_price_id: string | null;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          description?: string | null;
          price_cents: number;
          product_type: 'package' | 'template' | 'print' | 'addon';
          image_count?: number | null;
          stripe_price_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          description?: string | null;
          price_cents?: number;
          product_type?: 'package' | 'template' | 'print' | 'addon';
          image_count?: number | null;
          stripe_price_id?: string | null;
          is_active?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          tenant_id: string;
          client_id: string;
          product_id: string;
          album_id: string | null;
          status: 'pending' | 'paid' | 'processing' | 'fulfilled' | 'refunded' | 'cancelled';
          amount_cents: number;
          platform_fee_cents: number;
          stripe_payment_intent_id: string | null;
          paid_at: string | null;
          fulfilled_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          client_id: string;
          product_id: string;
          album_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'fulfilled' | 'refunded' | 'cancelled';
          amount_cents: number;
          platform_fee_cents?: number;
          stripe_payment_intent_id?: string | null;
          paid_at?: string | null;
          fulfilled_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          client_id?: string;
          product_id?: string;
          album_id?: string | null;
          status?: 'pending' | 'paid' | 'processing' | 'fulfilled' | 'refunded' | 'cancelled';
          amount_cents?: number;
          platform_fee_cents?: number;
          stripe_payment_intent_id?: string | null;
          paid_at?: string | null;
          fulfilled_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          tenant_id: string;
          name: string;
          date: string | null;
          location: string | null;
          sport: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          name: string;
          date?: string | null;
          location?: string | null;
          sport?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          tenant_id?: string;
          name?: string;
          date?: string | null;
          location?: string | null;
          sport?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_platform_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      is_tenant_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: 'platform_admin' | 'tenant_owner' | 'tenant_admin' | 'tenant_staff' | 'client';
      subscription_plan: 'free' | 'pro' | 'studio' | 'enterprise';
      subscription_status: 'active' | 'past_due' | 'cancelled' | 'suspended';
      album_status: 'draft' | 'processing' | 'proofing' | 'ready' | 'delivered';
      order_status: 'pending' | 'paid' | 'processing' | 'fulfilled' | 'refunded' | 'cancelled';
      product_type: 'package' | 'template' | 'print' | 'addon';
    };
    CompositeTypes: Record<string, never>;
  };
};

// Helper types for easier access
export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];

// Convenience types
export type Tenant = Tables<'tenants'>;
export type Profile = Tables<'profiles'>;
export type Album = Tables<'albums'>;
export type Image = Tables<'images'>;
export type Product = Tables<'products'>;
export type Order = Tables<'orders'>;
export type Event = Tables<'events'>;

export type UserRole = Enums<'user_role'>;
export type SubscriptionPlan = Enums<'subscription_plan'>;
export type SubscriptionStatus = Enums<'subscription_status'>;
export type AlbumStatus = Enums<'album_status'>;
export type OrderStatus = Enums<'order_status'>;
export type ProductType = Enums<'product_type'>;
