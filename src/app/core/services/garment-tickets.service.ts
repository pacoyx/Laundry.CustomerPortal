import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CreateGarmentTicketRequest,
  GARMENT_TICKET_STATUS_LABELS,
  GarmentTicketApi,
  GarmentTicketDetail,
  GarmentTicketFilter,
  GarmentTicketListItem,
  GarmentTicketPendingSummaryItemApi,
  GarmentTicketServiceItemLookupApi,
  GarmentTicketSummaryApi
} from '../models/garment-ticket.models';

function toListItem(ticket: GarmentTicketSummaryApi): GarmentTicketListItem {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    status: GARMENT_TICKET_STATUS_LABELS[ticket.status] ?? 'Pendiente',
    created: ticket.created,
    totalQuantity: ticket.totalQuantity,
    lineCount: ticket.lineCount
  };
}

function toDetail(ticket: GarmentTicketApi): GarmentTicketDetail {
  return {
    id: ticket.id,
    ticketNumber: ticket.ticketNumber,
    status: GARMENT_TICKET_STATUS_LABELS[ticket.status] ?? 'Pendiente',
    created: ticket.created,
    createdByUserName: ticket.createdByUserName,
    voidedReason: ticket.voidedReason,
    voidedAt: ticket.voidedAt,
    voidedByUserName: ticket.voidedByUserName,
    pickedUpAt: ticket.pickedUpAt,
    lines: ticket.details,
    photos: ticket.photos
  };
}

@Injectable({ providedIn: 'root' })
export class GarmentTicketsService {
  constructor(private readonly http: HttpClient) {}

  getServiceItems(): Observable<GarmentTicketServiceItemLookupApi[]> {
    return this.http.get<GarmentTicketServiceItemLookupApi[]>(`${environment.apiUrl}/garment-tickets/service-items`);
  }

  create(request: CreateGarmentTicketRequest): Observable<GarmentTicketDetail> {
    return this.http
      .post<GarmentTicketApi>(`${environment.apiUrl}/garment-tickets`, request)
      .pipe(map(toDetail));
  }

  list(filter: GarmentTicketFilter): Observable<GarmentTicketListItem[]> {
    let params = new HttpParams();
    if (filter.status) params = params.set('status', filter.status);
    if (filter.ticketNumber) params = params.set('ticketNumber', filter.ticketNumber);

    return this.http
      .get<GarmentTicketSummaryApi[]>(`${environment.apiUrl}/garment-tickets`, { params })
      .pipe(map((items) => items.map(toListItem)));
  }

  getById(id: number): Observable<GarmentTicketDetail> {
    return this.http.get<GarmentTicketApi>(`${environment.apiUrl}/garment-tickets/${id}`).pipe(map(toDetail));
  }

  void(id: number, reason: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/garment-tickets/${id}/void`, { reason });
  }

  getPendingSummary(): Observable<GarmentTicketPendingSummaryItemApi[]> {
    return this.http.get<GarmentTicketPendingSummaryItemApi[]>(`${environment.apiUrl}/garment-tickets/pending-summary`);
  }

  uploadPhoto(ticketId: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<void>(`${environment.apiUrl}/garment-tickets/${ticketId}/photos`, formData);
  }

  downloadPhoto(photoId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/garment-tickets/photos/${photoId}/download`, { responseType: 'blob' });
  }
}
