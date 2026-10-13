import { Permission } from './auth.models';

export interface CustomerUserListItem {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
  active: boolean;
}

export interface CustomerUserCreateRequest {
  fullName: string;
  username: string;
  email: string;
  role: string;
  permissions: Permission[];
}

export interface CustomerUserUpdateRequest {
  fullName: string;
  email: string;
  role: string;
  permissions: Permission[];
}
