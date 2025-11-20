// src/store/types.ts
export interface Customer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomerState {
  user: Customer | null;
  loading: boolean;
  error: string | null;
}


