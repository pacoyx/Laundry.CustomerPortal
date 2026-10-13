import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  INVOICE_STATUS_LABELS,
  InvoiceApiDetail,
  InvoiceApiListItem,
  InvoiceDetail,
  InvoiceFilter,
  InvoiceListItem
} from '../models/invoice.models';

@Injectable({ providedIn: 'root' })
export class InvoicesService {
  constructor(private readonly http: HttpClient) {}

  list(filter: InvoiceFilter): Observable<InvoiceListItem[]> {
    let params = new HttpParams();
    if (filter.startDate) params = params.set('startDate', filter.startDate);
    if (filter.endDate) params = params.set('endDate', filter.endDate);
    if (filter.status) params = params.set('status', filter.status);

    return this.http.get<InvoiceApiListItem[]>(`${environment.apiUrl}/invoices`, { params }).pipe(
      map((items) =>
        items.map((item) => ({
          id: item.id,
          number: `${item.serie}-${item.numero}`,
          date: item.issueDate,
          dueDate: item.dueDate,
          amount: item.total,
          amountPaid: item.amountPaid,
          balance: item.balance,
          status: INVOICE_STATUS_LABELS[item.status] ?? 'Borrador'
        }))
      )
    );
  }

  getById(id: number): Observable<InvoiceDetail> {
    return this.http.get<InvoiceApiDetail>(`${environment.apiUrl}/invoices/${id}`).pipe(
      map((detail) => ({
        id: detail.id,
        number: `${detail.serie}-${detail.numero}`,
        date: detail.issueDate,
        dueDate: detail.dueDate,
        status: INVOICE_STATUS_LABELS[detail.status] ?? 'Borrador',
        notes: detail.notes,
        subtotal: detail.subTotal,
        tax: detail.igv,
        total: detail.total,
        amountPaid: detail.amountPaid,
        balance: detail.balance,
        lines: detail.details.map((line) => ({
          description: line.description,
          quantity: line.quantity,
          unitPrice: line.unitPrice,
          amount: line.total
        }))
      }))
    );
  }
}
