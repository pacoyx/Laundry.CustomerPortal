export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthTokens {
  token: string;
  refreshToken: string;
}

export interface LoginResponseUser {
  customerId: number;
  customerUserId: number;
  role: string;
  companyName: string;
}

export interface LoginResponse extends AuthTokens {
  user: LoginResponseUser;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ActivateAccountRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface ForgotPasswordRequest {
  username: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export type Permission = 'guides.view' | 'invoices.view' | 'reports.view' | 'users.manage';

export interface MeResponse {
  customerId: number;
  customerUserId: number;
  role: string;
  companyName: string;
}

export interface JwtClaims {
  unique_name: string;
  userType: string;
  customerPermissions: Permission[];
}

export interface UserProfile {
  userType: string;
  customerId: number;
  customerUserId: number;
  role: string;
  fullName: string;
  username: string;
  email: string;
  customerName: string;
  permissions: Permission[];
}
