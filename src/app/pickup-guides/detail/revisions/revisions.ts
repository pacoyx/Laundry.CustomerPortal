import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PickupGuideRevision } from '../../../core/models/pickup-guide.models';
import { PickupGuidesService } from '../../../core/services/pickup-guides.service';

@Component({
  selector: 'app-pickup-guide-revisions',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './revisions.html',
  styleUrl: './revisions.scss'
})
export class PickupGuideRevisions implements OnInit {
  @Input({ required: true }) guideId!: number;

  private readonly pickupGuidesService = inject(PickupGuidesService);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly revisions = signal<PickupGuideRevision[]>([]);

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.pickupGuidesService.getRevisions(this.guideId).subscribe({
      next: (revisions) => {
        this.revisions.set(revisions);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }
}
