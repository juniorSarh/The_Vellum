export interface Customer {
  id?: number;

  email: string;
  first_name: string;
  last_name: string;

  phone?: string | null;
  address?: string | null;

  is_active: boolean;
  last_login?: string | null;

  created_at?: string;
  updated_at?: string;

  password_hash?: string; // included only in queries requiring password
}

export interface CustomerRegistration {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string | null;
  address?: string | null;
}

export interface CustomerLogin {
  email: string;
  password: string;
}

export interface CustomerProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string | null;
  address?: string | null;
}
