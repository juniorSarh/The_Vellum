export interface Admin {
  id?: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string | null;
  address?: string | null;
  is_active?: boolean;
  last_login?: Date | null;
  created_at?: Date;
  updated_at?: Date;
}

export interface AdminRegistration {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface AdminLogin {
  email: string;
  password: string;
}

export interface AdminProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  address?: string;
}
