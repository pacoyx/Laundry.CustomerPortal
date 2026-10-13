import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MonthlySummaryReport } from '../core/models/report.models';
import { AuthService } from '../core/services/auth.service';
import { ReportsService } from '../core/services/reports.service';
import { KpiCard } from '../shared/components/kpi-card/kpi-card';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [KpiCard, MatProgressSpinnerModule, CurrencyPipe, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly reportsService = inject(ReportsService);

  readonly profile = this.authService.profile;
  readonly loading = signal(true);
  readonly summary = signal<MonthlySummaryReport | null>(null);

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
