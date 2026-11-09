import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompanyWorkerApi, CompanyWorkerListItem, CompanyWorkerRequest } from '../models/company-worker.models';

function toListItem(worker: CompanyWorkerApi): CompanyWorkerListItem {
  return {
    id: worker.id,
    code: worker.code,
    fullName: worker.fullName,
    area: worker.area,
    active: worker.isActive
  };
}

@Injectable({ providedIn: 'root' })
export class CompanyWorkersService {
  constructor(private readonly http: HttpClient) {}

  list(onlyActive = false): Observable<CompanyWorkerListItem[]> {
    let params = new HttpParams();
    if (onlyActive) params = params.set('onlyActive', 'true');

    return this.http
      .get<CompanyWorkerApi[]>(`${environment.apiUrl}/workers`, { params })
      .pipe(map((workers) => workers.map(toListItem)));
  }

  create(request: CompanyWorkerRequest): Observable<CompanyWorkerListItem> {
    return this.http.post<CompanyWorkerApi>(`${environment.apiUrl}/workers`, request).pipe(map(toListItem));
  }

  update(id: number, request: CompanyWorkerRequest): Observable<CompanyWorkerListItem> {
    return this.http.put<CompanyWorkerApi>(`${environment.apiUrl}/workers/${id}`, request).pipe(map(toListItem));
  }

  toggleActive(id: number): Observable<{ id: number; isActive: boolean }> {
    return this.http.post<{ id: number; isActive: boolean }>(`${environment.apiUrl}/workers/${id}/deactivate`, {});
  }
}
