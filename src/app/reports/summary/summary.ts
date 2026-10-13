import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MonthlySummaryReport } from '../../core/models/report.models';
import { ReportsService } from '../../core/services/reports.service';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-reports-summary',
  standalone: true,
  imports: [KpiCard, MatProgressSpinnerModule, CurrencyPipe, DecimalPipe],
  templateUrl: './summary.html'
})
export class ReportsSummary implements OnInit {
  readonly loading = signal(true);
  readonly summary = signal<MonthlySummaryReport | null>(null);

  constructor(private readonly reportsService: ReportsService) {}

  ngOnInit(): void {
    this.reportsService.getMonthlySummary().subscribe({
      next: (summary) => {
        this.summary.set(summary);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
