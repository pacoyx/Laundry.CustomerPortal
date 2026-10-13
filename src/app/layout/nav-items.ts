import { Permission } from '../core/models/auth.models';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  permission?: Permission;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
  { label: 'Mis Guías', icon: 'local_shipping', route: '/pickup-guides', permission: 'guides.view' },
  { label: 'Mis Facturas', icon: 'receipt_long', route: '/invoices', permission: 'invoices.view' },
  { label: 'Reportes', icon: 'bar_chart', route: '/reports', permission: 'reports.view' },
  { label: 'Usuarios', icon: 'group', route: '/users', permission: 'users.manage' }
];
