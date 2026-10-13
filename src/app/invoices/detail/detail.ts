import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { InvoiceDetail } from '../../core/models/invoice.models';
import { InvoicesService } from '../../core/services/invoices.service';
import { StatusChip } from '../../shared/components/status-chip/status-chip';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    StatusChip,
    CurrencyPipe,
    DatePipe
  ],
  templateUrl: './detail.html'
})
export class InvoiceDetailComponent implements OnInit {
  readonly loading = signal(true);
  readonly invoice = signal<InvoiceDetail | null>(null);
  readonly displayedColumns = ['description', 'quantity', 'unitPrice', 'amount'];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly invoicesService: InvoicesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.invoicesService.getById(id).subscribe({
      next: (invoice) => {
        this.invoice.set(invoice);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
