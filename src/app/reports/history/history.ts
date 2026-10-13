import { Component, OnInit, signal } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { HistoryReportItem } from '../../core/models/report.models';
import { ReportsService } from '../../core/services/reports.service';

@Component({
  selector: 'app-reports-history',
  standalone: true,
  imports: [MatProgressSpinnerModule, BaseChartDirective],
  templateUrl: './history.html'
})
export class ReportsHistory implements OnInit {
  readonly loading = signal(true);
  readonly items = signal<HistoryReportItem[]>([]);

  readonly weightAmountData = signal<ChartConfiguration<'line'>['data']>({ labels: [], datasets: [] });
  readonly guidesData = signal<ChartConfiguration<'bar'>['data']>({ labels: [], datasets: [] });

  readonly chartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false }
  };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private readonly reportsService: ReportsService) {}

  ngOnInit(): void {
    this.reportsService.getHistory().subscribe({
      next: (items) => {
        this.items.set(items);
        this.weightAmountData.set({
          labels: items.map((i) => i.period),
          datasets: [
            {
              label: 'Peso Total (kg)',
              data: items.map((i) => i.totalWeight),
              borderColor: '#1e88e5',
              backgroundColor: 'rgba(30, 136, 229, 0.15)',
              tension: 0.3,
              fill: true
            },
            {
              label: 'Monto Total',
              data: items.map((i) => i.totalAmount),
              borderColor: '#3f51b5',
              backgroundColor: 'rgba(63, 81, 181, 0.15)',
              tension: 0.3,
              fill: true,
              yAxisID: 'y1'
            }
          ]
        });
        this.guidesData.set({
          labels: items.map((i) => i.period),
          datasets: [
            {
              label: 'Total Guías',
              data: items.map((i) => i.totalGuides),
              backgroundColor: '#607d8b'
            }
          ]
        });
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
