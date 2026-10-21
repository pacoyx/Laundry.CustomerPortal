import { DatePipe, CurrencyPipe } from '@angular/common';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { PickupGuideListItem, PickupGuideStatus } from '../../core/models/pickup-guide.models';
import { PickupGuidesService } from '../../core/services/pickup-guides.service';
import { StatusChip } from '../../shared/components/status-chip/status-chip';

const STATUSES: PickupGuideStatus[] = ['Borrador', 'Recolectada', 'Procesada', 'Facturada', 'Anulada'];

@Component({
  selector: 'app-pickup-guides-list',
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
    MatTooltipModule,
    StatusChip,
    DatePipe,
    CurrencyPipe
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class PickupGuidesList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly pickupGuidesService = inject(PickupGuidesService);

  readonly statuses = STATUSES;
  readonly loading = signal(true);
  readonly guides = signal<PickupGuideListItem[]>([]);
  readonly displayedColumns = ['physicalGuideNumber', 'date', 'status', 'totalAmount', 'evidence', 'actions'];

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

    this.pickupGuidesService
      .list({
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: endDate ? endDate.toISOString() : undefined,
        status: (status as PickupGuideStatus) || ''
      })
      .subscribe({
        next: (guides) => {
          this.guides.set(guides);
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
