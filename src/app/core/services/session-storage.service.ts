import { Injectable } from '@angular/core';
import { UserProfile } from '../models/auth.models';

const ACCESS_TOKEN_KEY = 'lcp_access_token';
const REFRESH_TOKEN_KEY = 'lcp_refresh_token';
const PROFILE_KEY = 'lcp_profile';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
  getAccessToken(): string | null {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  setTokens(accessToken: string, refreshToken: string): void {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }

  getProfile(): UserProfile | null {
    const raw = sessionStorage.getItem(PROFILE_KEY);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  }

  setProfile(profile: UserProfile): void {
    sessionStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }

  clear(): void {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(PROFILE_KEY);
  }
}
