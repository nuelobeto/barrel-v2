export interface ActivateAccountType {
  email: string;
  password: string;
}

export interface CreatePasswordType {
  password: string;
  verificationToken: string;
}

export interface UpdateProfileType {
  first_name?: string;
  last_name?: string;
  user_name?: string;
  avatar?: string | null;
}

export interface LoginType {
  email: string;
  password: string;
}

export interface ForgotPasswordType {
  email: string;
}

export interface ResetPasswordType {
  password: string;
  hash_id: string;
}

export interface UserType {
  avatar: string | null;
  business_id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_name: string;
  role_id: string;
  user_id: string;
  verified: boolean;
}
