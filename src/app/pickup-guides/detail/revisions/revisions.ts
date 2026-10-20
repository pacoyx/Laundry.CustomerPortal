import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  PickupGuideRevision,
  PickupGuideRevisionPhoto,
  REVISION_ACTION_TYPE_LABELS
} from '../../../core/models/pickup-guide.models';
import { PickupGuidesService } from '../../../core/services/pickup-guides.service';
import { ImagePreviewDialog } from '../../../shared/components/image-preview-dialog/image-preview-dialog';
import { downloadBlob } from '../../../shared/utils/file-download.util';

@Component({
  selector: 'app-pickup-guide-revisions',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './revisions.html',
  styleUrl: './revisions.scss'
})
export class PickupGuideRevisions implements OnInit, OnDestroy {
  @Input({ required: true }) guideId!: number;

  private readonly pickupGuidesService = inject(PickupGuidesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly revisions = signal<PickupGuideRevision[]>([]);
  readonly actionTypeLabels = REVISION_ACTION_TYPE_LABELS;
  readonly imageUrls = signal<Record<number, string>>({});
  readonly imageLoading = signal<Record<number, boolean>>({});

  private readonly blobCache = new Map<number, Blob>();
  private readonly objectUrls: string[] = [];

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.objectUrls.forEach((url) => URL.revokeObjectURL(url));
  }

  load(): void {
    this.loading.set(true);
    this.error.set(false);

    this.pickupGuidesService.getRevisions(this.guideId).subscribe({
      next: (revisions) => {
        this.revisions.set(revisions);
        this.loading.set(false);
        revisions.forEach((revision) => revision.photos.forEach((photo) => this.preloadImage(photo)));
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  private preloadImage(photo: PickupGuideRevisionPhoto): void {
    this.imageLoading.update((state) => ({ ...state, [photo.id]: true }));
    this.getBlob(photo).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        this.imageUrls.update((state) => ({ ...state, [photo.id]: url }));
        this.imageLoading.update((state) => ({ ...state, [photo.id]: false }));
      },
      error: () => {
        this.imageLoading.update((state) => ({ ...state, [photo.id]: false }));
      }
    });
  }

  private getBlob(photo: PickupGuideRevisionPhoto): Observable<Blob> {
    const cached = this.blobCache.get(photo.id);
    if (cached) {
      return of(cached);
    }
    return this.pickupGuidesService
      .downloadRevisionPhoto(photo.id)
      .pipe(tap((blob) => this.blobCache.set(photo.id, blob)));
  }

  viewPhoto(photo: PickupGuideRevisionPhoto): void {
    const cachedUrl = this.imageUrls()[photo.id];
    if (cachedUrl) {
      this.openPreview(photo, cachedUrl);
      return;
    }

    this.getBlob(photo).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        this.openPreview(photo, url);
      },
      error: () => this.notifyDownloadError()
    });
  }

  private openPreview(photo: PickupGuideRevisionPhoto, imageUrl: string): void {
    this.dialog.open(ImagePreviewDialog, {
      data: {
        title: `Evidencia de revisión — ${photo.originalFileName}`,
        imageUrl,
        onDownload: () => this.download(photo)
      }
    });
  }

  private download(photo: PickupGuideRevisionPhoto): void {
    this.getBlob(photo).subscribe({
      next: (blob) => downloadBlob(blob, photo.originalFileName),
      error: () => this.notifyDownloadError()
    });
  }

  private notifyDownloadError(): void {
    this.snackBar.open('No se pudo cargar la foto de evidencia.', 'Cerrar', { duration: 4000 });
  }
}
