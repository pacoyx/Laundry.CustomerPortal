import { Permission } from './auth.models';

export interface CustomerRoleApi {
  id: number;
  name: string;
  description: string;
}

export interface CustomerUserApi {
  id: number;
  fullName: string;
  email: string;
  userName: string;
  customerRoleId: number;
  roleName: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt: string | null;
}

export interface CustomerUserListItem {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  roleId: number;
  active: boolean;
}

export interface CustomerUserCreateRequest {
  fullName: string;
  userName: string;
  email: string;
  customerRoleId: number;
  permissions: Permission[];
}

export interface CustomerUserUpdateRequest {
  fullName: string;
  email: string;
  customerRoleId: number;
  permissions: Permission[];
}
