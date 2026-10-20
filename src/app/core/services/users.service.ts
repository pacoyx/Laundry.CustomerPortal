import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CustomerUserApi,
  CustomerUserCreateRequest,
  CustomerUserListItem,
  CustomerUserUpdateRequest
} from '../models/user.models';

function toListItem(user: CustomerUserApi): CustomerUserListItem {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.userName,
    email: user.email,
    role: user.roleName,
    roleId: user.customerRoleId,
    active: user.isActive
  };
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<CustomerUserListItem[]> {
    return this.http
      .get<CustomerUserApi[]>(`${environment.apiUrl}/users`)
      .pipe(map((users) => users.map(toListItem)));
  }

  create(request: CustomerUserCreateRequest): Observable<CustomerUserListItem> {
    return this.http
      .post<CustomerUserApi>(`${environment.apiUrl}/users`, request)
      .pipe(map(toListItem));
  }

  update(id: number, request: CustomerUserUpdateRequest): Observable<CustomerUserListItem> {
    return this.http
      .put<CustomerUserApi>(`${environment.apiUrl}/users/${id}`, request)
      .pipe(map(toListItem));
  }

  deactivate(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users/${id}/deactivate`, {});
  }

  generateActivationLink(id: number): Observable<{ link: string }> {
    return this.http.post<{ link: string }>(`${environment.apiUrl}/users/${id}/generate-activation-link`, {});
  }
}
