import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ByServiceReportApiItem,
  ByServiceReportItem,
  HistoryReportApiItem,
  HistoryReportItem,
  MonthlySummaryReport
} from '../models/report.models';

const MONTH_LABELS = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

@Injectable({ providedIn: 'root' })
export class ReportsService {
  constructor(private readonly http: HttpClient) {}

  getMonthlySummary(): Observable<MonthlySummaryReport> {
    return this.http.get<MonthlySummaryReport>(`${environment.apiUrl}/reports/monthly-summary`);
  }

  getHistory(months = 12): Observable<HistoryReportItem[]> {
    const params = new HttpParams().set('months', months);
    return this.http.get<HistoryReportApiItem[]>(`${environment.apiUrl}/reports/history`, { params }).pipe(
      map((items) =>
        items.map((item) => ({
          period: `${MONTH_LABELS[item.month - 1] ?? item.month} ${item.year}`,
          totalGuides: item.guideCount,
          totalWeight: item.totalWeight,
          totalAmount: item.totalAmount
        }))
      )
    );
  }

  getByService(): Observable<ByServiceReportItem[]> {
    return this.http.get<ByServiceReportApiItem[]>(`${environment.apiUrl}/reports/by-service`).pipe(
      map((items) =>
        items.map((item) => ({
          serviceName: item.serviceItemName,
          quantity: item.totalQuantity,
          weight: item.totalWeight,
          amount: item.totalAmount
        }))
      )
    );
  }
}
