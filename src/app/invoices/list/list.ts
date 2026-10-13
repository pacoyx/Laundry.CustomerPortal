import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { InvoiceListItem, InvoiceStatus } from '../../core/models/invoice.models';
import { InvoicesService } from '../../core/services/invoices.service';
import { StatusChip } from '../../shared/components/status-chip/status-chip';

const STATUSES: InvoiceStatus[] = ['Borrador', 'Emitida', 'Pago Parcial', 'Pagado', 'Anulada'];

@Component({
  selector: 'app-invoices-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    StatusChip,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './list.html'
})
export class InvoicesList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly invoicesService = inject(InvoicesService);

  readonly statuses = STATUSES;
  readonly loading = signal(true);
  readonly invoices = signal<InvoiceListItem[]>([]);
  readonly displayedColumns = ['number', 'date', 'amount', 'status', 'actions'];

  readonly filterForm = this.fb.group({
    startDate: [null as Date | null],
    endDate: [null as Date | null],
    status: ['']
  });

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading.set(true);
    const { startDate, endDate, status } = this.filterForm.getRawValue();

    this.invoicesService
      .list({
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        status: (status as InvoiceStatus) || ''
      })
      .subscribe({
        next: (invoices) => {
          this.invoices.set(invoices);
          this.loading.set(false);
        },
        error: () => this.loading.set(false)
      });
  }

  clearFilters(): void {
    this.filterForm.reset({ startDate: null, endDate: null, status: '' });
    this.search();
  }
}
