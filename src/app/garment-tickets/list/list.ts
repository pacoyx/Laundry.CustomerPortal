import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import {
  GARMENT_TICKET_STATUS_VALUES,
  GarmentTicketListItem,
  GarmentTicketPendingSummaryItemApi
} from '../../core/models/garment-ticket.models';
import { GarmentTicketsService } from '../../core/services/garment-tickets.service';
import { StatusChip } from '../../shared/components/status-chip/status-chip';

@Component({
  selector: 'app-garment-tickets-list',
  standalone: true,
  imports: [
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    StatusChip,
    DatePipe
  ],
  templateUrl: './list.html',
  styleUrl: './list.scss'
})
export class GarmentTicketsList implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ticketsService = inject(GarmentTicketsService);
  private readonly router = inject(Router);

  readonly loading = signal(true);
  readonly tickets = signal<GarmentTicketListItem[]>([]);
  readonly pendingSummary = signal<GarmentTicketPendingSummaryItemApi[]>([]);
  readonly summaryLoading = signal(true);
  readonly displayedColumns = ['ticketNumber', 'created', 'totalQuantity', 'lineCount', 'status', 'actions'];

  readonly statusOptions = [
    { value: '', label: 'Todos' },
    { value: GARMENT_TICKET_STATUS_VALUES.Pendiente, label: 'Pendiente' },
    { value: GARMENT_TICKET_STATUS_VALUES.Recogido, label: 'Recogido' },
    { value: GARMENT_TICKET_STATUS_VALUES.Anulado, label: 'Anulado' }
  ];

  readonly filterForm = this.fb.group({
    status: ['' as number | ''],
    ticketNumber: ['']
  });

  ngOnInit(): void {
    this.search();
    this.loadPendingSummary();
  }

  search(): void {
    this.loading.set(true);
    const { status, ticketNumber } = this.filterForm.getRawValue();
    this.ticketsService.list({ status: status || undefined, ticketNumber: ticketNumber || undefined }).subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  loadPendingSummary(): void {
    this.summaryLoading.set(true);
    this.ticketsService.getPendingSummary().subscribe({
      next: (summary) => {
        this.pendingSummary.set(summary);
        this.summaryLoading.set(false);
      },
      error: () => this.summaryLoading.set(false)
    });
  }

  viewTicket(id: number): void {
    this.router.navigate(['/garment-tickets', id]);
  }
}
