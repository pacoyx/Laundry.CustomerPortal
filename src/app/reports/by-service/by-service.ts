import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { ByServiceReportItem } from '../../core/models/report.models';
import { ReportsService } from '../../core/services/reports.service';

const PALETTE = ['#3f51b5', '#1e88e5', '#607d8b', '#5c6bc0', '#42a5f5', '#78909c'];

@Component({
  selector: 'app-reports-by-service',
  standalone: true,
  imports: [MatProgressSpinnerModule, BaseChartDirective, DecimalPipe, CurrencyPipe],
  templateUrl: './by-service.html'
})
export class ReportsByService implements OnInit {
  readonly loading = signal(true);
  readonly items = signal<ByServiceReportItem[]>([]);
  readonly amountData = signal<ChartConfiguration<'doughnut'>['data']>({ labels: [], datasets: [] });

  readonly chartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  constructor(private readonly reportsService: ReportsService) {}

  ngOnInit(): void {
    this.reportsService.getByService().subscribe({
      next: (items) => {
        this.items.set(items);
        this.amountData.set({
          labels: items.map((i) => i.serviceName),
          datasets: [
            {
              data: items.map((i) => i.amount),
              backgroundColor: PALETTE
            }
          ]
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
