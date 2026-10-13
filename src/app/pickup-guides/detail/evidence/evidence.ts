import { DatePipe } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  ATTACHMENT_TYPE_PDF,
  ATTACHMENT_TYPE_PHOTO,
  ATTACHMENT_TYPE_SIGNATURE,
  PickupGuideAttachment
} from '../../../core/models/pickup-guide.models';
import { PickupGuidesService } from '../../../core/services/pickup-guides.service';
import { ImagePreviewDialog } from '../../../shared/components/image-preview-dialog/image-preview-dialog';
import { downloadBlob, openBlobInNewTab } from '../../../shared/utils/file-download.util';

@Component({
  selector: 'app-pickup-guide-evidence',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, DatePipe],
  templateUrl: './evidence.html',
  styleUrl: './evidence.scss'
})
export class PickupGuideEvidence implements OnInit, OnDestroy {
  @Input({ required: true }) guideId!: number;

  private readonly pickupGuidesService = inject(PickupGuidesService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly error = signal(false);
  readonly attachments = signal<PickupGuideAttachment[]>([]);
  readonly imageUrls = signal<Record<number, string>>({});
  readonly imageLoading = signal<Record<number, boolean>>({});

  readonly pdfAttachments = computed(() => this.attachments().filter((a) => a.attachmentType === ATTACHMENT_TYPE_PDF));
  readonly photoAttachments = computed(() =>
    this.attachments().filter((a) => a.attachmentType === ATTACHMENT_TYPE_PHOTO)
  );
  readonly signatureAttachments = computed(() =>
    this.attachments().filter((a) => a.attachmentType === ATTACHMENT_TYPE_SIGNATURE)
  );

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

    this.pickupGuidesService.getAttachments(this.guideId).subscribe({
      next: (attachments) => {
        this.attachments.set(attachments);
        this.loading.set(false);
        attachments
          .filter((a) => a.attachmentType === ATTACHMENT_TYPE_PHOTO || a.attachmentType === ATTACHMENT_TYPE_SIGNATURE)
          .forEach((a) => this.preloadImage(a));
      },
      error: () => {
        this.loading.set(false);
        this.error.set(true);
      }
    });
  }

  private preloadImage(attachment: PickupGuideAttachment): void {
    this.imageLoading.update((state) => ({ ...state, [attachment.id]: true }));
    this.getBlob(attachment).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        this.imageUrls.update((state) => ({ ...state, [attachment.id]: url }));
        this.imageLoading.update((state) => ({ ...state, [attachment.id]: false }));
      },
      error: () => {
        this.imageLoading.update((state) => ({ ...state, [attachment.id]: false }));
      }
    });
  }

  private getBlob(attachment: PickupGuideAttachment): Observable<Blob> {
    const cached = this.blobCache.get(attachment.id);
    if (cached) {
      return of(cached);
    }
    return this.pickupGuidesService
      .downloadAttachment(attachment.id)
      .pipe(tap((blob) => this.blobCache.set(attachment.id, blob)));
  }

  viewPdf(attachment: PickupGuideAttachment): void {
    this.getBlob(attachment).subscribe({
      next: (blob) => openBlobInNewTab(blob),
      error: () => this.notifyDownloadError()
    });
  }

  viewPhoto(attachment: PickupGuideAttachment, title: string): void {
    const cachedUrl = this.imageUrls()[attachment.id];
    if (cachedUrl) {
      this.openPreview(attachment, title, cachedUrl);
      return;
    }

    this.getBlob(attachment).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        this.openPreview(attachment, title, url);
      },
      error: () => this.notifyDownloadError()
    });
  }

  private openPreview(attachment: PickupGuideAttachment, title: string, imageUrl: string): void {
    this.dialog.open(ImagePreviewDialog, {
      data: {
        title,
        imageUrl,
        onDownload: () => this.download(attachment)
      }
    });
  }

  download(attachment: PickupGuideAttachment): void {
    this.getBlob(attachment).subscribe({
      next: (blob) => downloadBlob(blob, attachment.originalFileName),
      error: () => this.notifyDownloadError()
    });
  }

  private notifyDownloadError(): void {
    this.snackBar.open('No se pudo descargar el archivo. Intenta nuevamente.', 'Cerrar', { duration: 4000 });
  }
}
