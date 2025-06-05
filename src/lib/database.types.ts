export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          full_name: string
          email: string
          role: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          role?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          role?: string
          created_at?: string
        }
      }
      events: {
        Row: {
          id: string
          name: string
          slogan: string | null
          description: string | null
          image_url: string | null
          start_time: string
          end_time: string
          status: string
          visibility: string
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slogan?: string | null
          description?: string | null
          image_url?: string | null
          start_time: string
          end_time: string
          status?: string
          visibility?: string
          created_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slogan?: string | null
          description?: string | null
          image_url?: string | null
          start_time?: string
          end_time?: string
          status?: string
          visibility?: string
          created_by?: string | null
          created_at?: string
        }
      }
      // Add other table types as needed
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}