import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { PickupGuideDetail } from '../../core/models/pickup-guide.models';
import { PickupGuidesService } from '../../core/services/pickup-guides.service';
import { StatusChip } from '../../shared/components/status-chip/status-chip';
import { PickupGuideEvidence } from './evidence/evidence';
import { PickupGuideRevisions } from './revisions/revisions';

@Component({
  selector: 'app-pickup-guide-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTabsModule,
    StatusChip,
    PickupGuideEvidence,
    PickupGuideRevisions,
    CurrencyPipe,
    DatePipe,
    DecimalPipe
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class PickupGuideDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly pickupGuidesService = inject(PickupGuidesService);

  readonly guideId = Number(this.route.snapshot.paramMap.get('id'));

  readonly loading = signal(true);
  readonly guide = signal<PickupGuideDetail | null>(null);
  readonly displayedColumns = ['description', 'quantity', 'weight', 'unitPrice', 'confirmedQuantity', 'amount'];

  ngOnInit(): void {
    this.pickupGuidesService.getById(this.guideId).subscribe({
      next: (guide) => {
        this.guide.set(guide);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
