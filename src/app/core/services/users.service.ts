import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CustomerUserCreateRequest, CustomerUserListItem, CustomerUserUpdateRequest } from '../models/user.models';

@Injectable({ providedIn: 'root' })
export class UsersService {
  constructor(private readonly http: HttpClient) {}

  list(): Observable<CustomerUserListItem[]> {
    return this.http.get<CustomerUserListItem[]>(`${environment.apiUrl}/users`);
  }

  create(request: CustomerUserCreateRequest): Observable<CustomerUserListItem> {
    return this.http.post<CustomerUserListItem>(`${environment.apiUrl}/users`, request);
  }

  update(id: number, request: CustomerUserUpdateRequest): Observable<CustomerUserListItem> {
    return this.http.put<CustomerUserListItem>(`${environment.apiUrl}/users/${id}`, request);
  }

  deactivate(id: number): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/users/${id}/deactivate`, {});
  }

  generateActivationLink(id: number): Observable<{ link: string }> {
    return this.http.post<{ link: string }>(`${environment.apiUrl}/users/${id}/generate-activation-link`, {});
  }
}
