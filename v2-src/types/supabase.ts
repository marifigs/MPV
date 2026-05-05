export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ── Row types ─────────────────────────────────────────────────────────────────
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: 'admin' | 'vendor';
  store: string | null;
  is_active: boolean;
  invited_by: string | null;
  created_at: string;
}

export interface AuditSession {
  id: string;
  user_id: string;
  user_email: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  last_seen_at: string;
  user_agent: string | null;
  page_count: number;
}

export interface AuditEvent {
  id: string;
  session_id: string;
  user_id: string;
  event_type: string;
  path: string;
  metadata: Json | null;
  created_at: string;
}

export interface HeatmapPoint {
  id: string;
  session_id: string;
  user_id: string;
  path: string;
  x: number;
  y: number;
  created_at: string;
}

// ── Supabase Database schema (exact shape required by @supabase/supabase-js) ──
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'admin' | 'vendor';
          store?: string | null;
          is_active?: boolean;
          invited_by?: string | null;
        };
        Update: {
          email?: string;
          full_name?: string | null;
          role?: 'admin' | 'vendor';
          store?: string | null;
          is_active?: boolean;
          invited_by?: string | null;
        };
        Relationships: [];
      };
      audit_sessions: {
        Row: AuditSession;
        Insert: {
          user_id: string;
          user_email: string;
          user_agent?: string | null;
          ended_at?: string | null;
          duration_seconds?: number | null;
          page_count?: number;
        };
        Update: {
          ended_at?: string | null;
          duration_seconds?: number | null;
          last_seen_at?: string;
          page_count?: number;
        };
        Relationships: [];
      };
      audit_events: {
        Row: AuditEvent;
        Insert: {
          session_id: string;
          user_id: string;
          event_type: string;
          path: string;
          metadata?: Json | null;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      heatmap_points: {
        Row: HeatmapPoint;
        Insert: {
          session_id: string;
          user_id: string;
          path: string;
          x: number;
          y: number;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};
