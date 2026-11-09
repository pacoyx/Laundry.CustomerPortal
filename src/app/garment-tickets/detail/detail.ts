import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { GarmentTicketDetail, GarmentTicketPhotoApi } from '../../core/models/garment-ticket.models';
import { GarmentTicketsService } from '../../core/services/garment-tickets.service';
import { ImagePreviewDialog } from '../../shared/components/image-preview-dialog/image-preview-dialog';
import { StatusChip } from '../../shared/components/status-chip/status-chip';
import { WebcamCapture } from '../../shared/components/webcam-capture/webcam-capture';
import { downloadBlob } from '../../shared/utils/file-download.util';
import { VoidTicketDialog } from '../void-ticket-dialog/void-ticket-dialog';

@Component({
  selector: 'app-garment-ticket-detail',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    StatusChip,
    WebcamCapture,
    DatePipe
  ],
  templateUrl: './detail.html',
  styleUrl: './detail.scss'
})
export class GarmentTicketDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly ticketsService = inject(GarmentTicketsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly ticketId = Number(this.route.snapshot.paramMap.get('id'));
  readonly loading = signal(true);
  readonly ticket = signal<GarmentTicketDetail | null>(null);
  readonly voiding = signal(false);
  readonly displayedColumns = ['workerName', 'serviceItemName', 'quantity', 'observations'];

  readonly wantsCamera = signal(false);
  readonly uploadingPhoto = signal(false);
  readonly imageUrls = signal<Record<number, string>>({});

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
    this.ticketsService.getById(this.ticketId).subscribe({
      next: (ticket) => {
        this.ticket.set(ticket);
        this.loading.set(false);
        ticket.photos.forEach((photo) => this.preloadImage(photo));
      },
      error: () => this.loading.set(false)
    });
  }

  goToPrint(): void {
    this.router.navigate(['/garment-tickets', this.ticketId, 'print']);
  }

  voidTicket(): void {
    this.dialog
      .open(VoidTicketDialog)
      .afterClosed()
      .subscribe((reason: string | null) => {
        if (!reason) {
          return;
        }
        this.voiding.set(true);
        this.ticketsService.void(this.ticketId, reason).subscribe({
          next: () => {
            this.voiding.set(false);
            this.snackBar.open('Ticket anulado correctamente', 'Cerrar', { duration: 3000 });
            this.load();
          },
          error: (err) => {
            this.voiding.set(false);
            const message = Array.isArray(err?.error) ? err.error[0] : 'No se pudo anular el ticket.';
            this.snackBar.open(message, 'Cerrar', { duration: 4000 });
          }
        });
      });
  }

  onPhotoCapturedLater(blob: Blob): void {
    this.uploadingPhoto.set(true);
    this.ticketsService
      .uploadPhoto(this.ticketId, new File([blob], 'captura.jpg', { type: 'image/jpeg' }))
      .subscribe({
        next: () => {
          this.uploadingPhoto.set(false);
          this.wantsCamera.set(false);
          this.snackBar.open('Foto agregada correctamente', 'Cerrar', { duration: 3000 });
          this.load();
        },
        error: () => {
          this.uploadingPhoto.set(false);
          this.snackBar.open('No se pudo subir la foto.', 'Cerrar', { duration: 4000 });
        }
      });
  }

  private preloadImage(photo: GarmentTicketPhotoApi): void {
    this.getBlob(photo).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.objectUrls.push(url);
        this.imageUrls.update((state) => ({ ...state, [photo.id]: url }));
      }
    });
  }

  private getBlob(photo: GarmentTicketPhotoApi): Observable<Blob> {
    const cached = this.blobCache.get(photo.id);
    if (cached) {
      return of(cached);
    }
    return this.ticketsService.downloadPhoto(photo.id).pipe(tap((blob) => this.blobCache.set(photo.id, blob)));
  }

  viewPhoto(photo: GarmentTicketPhotoApi): void {
    const url = this.imageUrls()[photo.id];
    if (!url) {
      return;
    }
    this.dialog.open(ImagePreviewDialog, {
      data: {
        title: photo.originalFileName,
        imageUrl: url,
        onDownload: () => this.downloadPhoto(photo)
      }
    });
  }

  downloadPhoto(photo: GarmentTicketPhotoApi): void {
    this.getBlob(photo).subscribe({
      next: (blob) => downloadBlob(blob, photo.originalFileName),
      error: () => this.snackBar.open('No se pudo descargar la foto.', 'Cerrar', { duration: 4000 })
    });
  }
}
