import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, switchMap, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ActivateAccountRequest,
  AuthTokens,
  ForgotPasswordRequest,
  JwtClaims,
  LoginRequest,
  LoginResponse,
  MeResponse,
  Permission,
  ResetPasswordRequest,
  UserProfile
} from '../models/auth.models';
import { decodeJwtPayload } from '../utils/jwt.util';
import { SessionStorageService } from './session-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(SessionStorageService);
  private readonly router = inject(Router);

  private readonly profileSignal = signal<UserProfile | null>(this.storage.getProfile());

  readonly profile = this.profileSignal.asReadonly();
  readonly isAuthenticated = computed(() => !!this.profileSignal());

  login(request: LoginRequest): Observable<UserProfile> {
    return this.http.post<LoginResponse>(`${environment.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.storage.setTokens(response.token, response.refreshToken);
      }),
      switchMap(() => this.loadProfile())
    );
  }

  refreshToken(): Observable<AuthTokens> {
    const refreshToken = this.storage.getRefreshToken();
    return this.http
      .post<AuthTokens>(`${environment.apiUrl}/refresh-token`, { refreshToken })
      .pipe(
        tap((response) => {
          this.storage.setTokens(response.token, response.refreshToken);
        })
      );
  }

  loadProfile(): Observable<UserProfile> {
    return this.http.get<MeResponse>(`${environment.apiUrl}/me`).pipe(
      map((me) => this.buildProfile(me)),
      tap((profile) => {
        this.storage.setProfile(profile);
        this.profileSignal.set(profile);
      })
    );
  }

  private buildProfile(me: MeResponse): UserProfile {
    const token = this.storage.getAccessToken();
    const claims = token ? decodeJwtPayload<JwtClaims>(token) : null;
    const username = claims?.unique_name ?? '';

    return {
      userType: claims?.userType ?? '',
      customerId: me.customerId,
      customerUserId: me.customerUserId,
      role: me.role,
      fullName: username,
      username,
      email: username,
      customerName: me.companyName,
      permissions: claims?.customerPermissions ?? []
    };
  }

  activateAccount(request: ActivateAccountRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/activate-account`, request);
  }

  forgotPassword(request: ForgotPasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/forgot-password`, request);
  }

  resetPassword(request: ResetPasswordRequest): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/reset-password`, request);
  }

  hasPermission(permission: Permission): boolean {
    return !!this.profileSignal()?.permissions?.includes(permission);
  }

  logout(): void {
    this.storage.clear();
    this.profileSignal.set(null);
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return this.storage.getAccessToken();
  }

  getRefreshToken(): string | null {
    return this.storage.getRefreshToken();
  }
}
