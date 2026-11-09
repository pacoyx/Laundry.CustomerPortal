import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { GarmentTicketDetail } from '../../core/models/garment-ticket.models';
import { GarmentTicketsService } from '../../core/services/garment-tickets.service';

@Component({
  selector: 'app-garment-ticket-print',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './print.html',
  styleUrl: './print.scss'
})
export class GarmentTicketPrint implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ticketsService = inject(GarmentTicketsService);
  private readonly authService = inject(AuthService);

  readonly ticketId = Number(this.route.snapshot.paramMap.get('id'));
  readonly loading = signal(true);
  readonly ticket = signal<GarmentTicketDetail | null>(null);
  readonly companyName = this.authService.profile()?.customerName ?? '';

  ngOnInit(): void {
    this.ticketsService.getById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.loading.set(false);
        setTimeout(() => window.print(), 200);
      },
      error: () => this.loading.set(false)
    });
  }

  get totalQuantity(): number {
    return this.ticket()?.lines.reduce((sum, line) => sum + line.quantity, 0) ?? 0;
  }

  print(): void {
    window.print();
  }

  goToDetail(): void {
    this.router.navigate(['/garment-tickets', this.ticketId]);
  }
}
