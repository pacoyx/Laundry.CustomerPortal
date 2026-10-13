import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { permissionGuard } from './core/guards/permission.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    loadComponent: () => import('./auth/login/login').then((m) => m.Login)
  },
  {
    path: 'activate-account',
    loadComponent: () => import('./auth/activate-account/activate-account').then((m) => m.ActivateAccount)
  },
  {
    path: 'forgot-password',
    loadComponent: () => import('./auth/forgot-password/forgot-password').then((m) => m.ForgotPassword)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./auth/reset-password/reset-password').then((m) => m.ResetPassword)
  },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./layout/main-layout/main-layout').then((m) => m.MainLayout),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard').then((m) => m.Dashboard)
      },
      {
        path: 'pickup-guides',
        canActivate: [permissionGuard('guides.view')],
        loadComponent: () => import('./pickup-guides/list/list').then((m) => m.PickupGuidesList)
      },
      {
        path: 'pickup-guides/:id',
        canActivate: [permissionGuard('guides.view')],
        loadComponent: () => import('./pickup-guides/detail/detail').then((m) => m.PickupGuideDetailComponent)
      },
      {
        path: 'invoices',
        canActivate: [permissionGuard('invoices.view')],
        loadComponent: () => import('./invoices/list/list').then((m) => m.InvoicesList)
      },
      {
        path: 'invoices/:id',
        canActivate: [permissionGuard('invoices.view')],
        loadComponent: () => import('./invoices/detail/detail').then((m) => m.InvoiceDetailComponent)
      },
      {
        path: 'reports',
        canActivate: [permissionGuard('reports.view')],
        loadComponent: () => import('./reports/reports').then((m) => m.Reports)
      },
      {
        path: 'users',
        canActivate: [permissionGuard('users.manage')],
        loadComponent: () => import('./users/list/list').then((m) => m.UsersList)
      },
      {
        path: 'users/new',
        canActivate: [permissionGuard('users.manage')],
        loadComponent: () => import('./users/form/form').then((m) => m.UserForm)
      },
      {
        path: 'users/:id/edit',
        canActivate: [permissionGuard('users.manage')],
        loadComponent: () => import('./users/form/form').then((m) => m.UserForm)
      }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
