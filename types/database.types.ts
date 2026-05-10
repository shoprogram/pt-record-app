export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      patients: {
        Row: {
          id: string
          user_id: string
          code: string
          name: string
          age: number
          gender: string
          diagnosis: string
          height: number | null
          weight: number | null
          medical_history: string | null
          medications: string | null
          last_visit_date: string | null
          start_date: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          name: string
          age: number
          gender: string
          diagnosis: string
          height?: number | null
          weight?: number | null
          medical_history?: string | null
          medications?: string | null
          last_visit_date?: string | null
          start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          code?: string
          name?: string
          age?: number
          gender?: string
          diagnosis?: string
          height?: number | null
          weight?: number | null
          medical_history?: string | null
          medications?: string | null
          last_visit_date?: string | null
          start_date?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      patient_records: {
        Row: {
          id: string
          patient_id: string
          user_id: string
          date: string
          session_id: string | null
          standard_evaluations: Json
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          user_id: string
          date: string
          session_id?: string | null
          standard_evaluations?: Json
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          user_id?: string
          date?: string
          session_id?: string | null
          standard_evaluations?: Json
          note?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      custom_evaluations: {
        Row: {
          id: string
          patient_record_id: string
          name: string
          value: string
          unit: string
          direction: 'higher_is_better' | 'lower_is_better'
          min_value: number | null
          max_value: number | null
          tags: string[] | null
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_record_id: string
          name: string
          value: string
          unit: string
          direction: 'higher_is_better' | 'lower_is_better'
          min_value?: number | null
          max_value?: number | null
          tags?: string[] | null
          note?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_record_id?: string
          name?: string
          value?: string
          unit?: string
          direction?: 'higher_is_better' | 'lower_is_better'
          min_value?: number | null
          max_value?: number | null
          tags?: string[] | null
          note?: string | null
          created_at?: string
        }
      }
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
