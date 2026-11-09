import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyWorkerListItem } from '../../core/models/company-worker.models';
import { GarmentTicketDetailRequest, GarmentTicketServiceItemLookupApi } from '../../core/models/garment-ticket.models';
import { CompanyWorkersService } from '../../core/services/company-workers.service';
import { GarmentTicketsService } from '../../core/services/garment-tickets.service';
import { WebcamCapture } from '../../shared/components/webcam-capture/webcam-capture';

interface DraftLine extends GarmentTicketDetailRequest {
  workerName: string;
  serviceItemName: string;
}

@Component({
  selector: 'app-garment-ticket-new',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    WebcamCapture
  ],
  templateUrl: './new.html',
  styleUrl: './new.scss'
})
export class GarmentTicketNew implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly workersService = inject(CompanyWorkersService);
  private readonly ticketsService = inject(GarmentTicketsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly loadError = signal(false);
  readonly workers = signal<CompanyWorkerListItem[]>([]);
  readonly serviceItems = signal<GarmentTicketServiceItemLookupApi[]>([]);
  readonly lines = signal<DraftLine[]>([]);
  readonly wantsPhotoNow = signal(false);
  readonly capturedPhotos = signal<{ blob: Blob; url: string }[]>([]);

  readonly lineForm = this.fb.group({
    workerId: [null as number | null, Validators.required],
    serviceItemId: [null as number | null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1)]],
    observations: ['']
  });

  get totalQuantity(): number {
    return this.lines().reduce((sum, line) => sum + line.quantity, 0);
  }

  ngOnInit(): void {
    this.loading.set(true);
    forkJoin({
      workers: this.workersService.list(true),
      serviceItems: this.ticketsService.getServiceItems()
    }).subscribe({
      next: ({ workers, serviceItems }) => {
        this.workers.set(workers);
        this.serviceItems.set(serviceItems);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
      }
    });
  }

  incrementQuantity(): void {
    const current = this.lineForm.get('quantity')?.value ?? 1;
    this.lineForm.patchValue({ quantity: current + 1 });
  }

  decrementQuantity(): void {
    const current = this.lineForm.get('quantity')?.value ?? 1;
    if (current > 1) {
      this.lineForm.patchValue({ quantity: current - 1 });
    }
  }

  addLine(): void {
    if (this.lineForm.invalid) {
      this.lineForm.markAllAsTouched();
      return;
    }

    const { workerId, serviceItemId, quantity, observations } = this.lineForm.getRawValue();
    const worker = this.workers().find((w) => w.id === workerId);
    const serviceItem = this.serviceItems().find((s) => s.serviceItemId === serviceItemId);

    if (!worker || !serviceItem) {
      return;
    }

    this.lines.update((lines) => [
      ...lines,
      {
        workerId: worker.id,
        serviceItemId: serviceItem.serviceItemId,
        quantity: quantity!,
        observations: observations || null,
        workerName: worker.fullName,
        serviceItemName: serviceItem.name
      }
    ]);

    this.lineForm.patchValue({ quantity: 1, observations: '' });
  }

  removeLine(index: number): void {
    this.lines.update((lines) => lines.filter((_, i) => i !== index));
  }

  onPhotoCaptured(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    this.capturedPhotos.update((photos) => [...photos, { blob, url }]);
  }

  removePhoto(index: number): void {
    this.capturedPhotos.update((photos) => {
      URL.revokeObjectURL(photos[index].url);
      return photos.filter((_, i) => i !== index);
    });
  }

  submit(): void {
    if (this.lines().length === 0) {
      this.snackBar.open('Agrega al menos una línea antes de registrar el ticket.', 'Cerrar', { duration: 4000 });
      return;
    }

    this.saving.set(true);
    const details = this.lines().map(({ workerId, serviceItemId, quantity, observations }) => ({
      workerId,
      serviceItemId,
      quantity,
      observations
    }));

    this.ticketsService.create({ details }).subscribe({
      next: (ticket) => {
        const photos = this.capturedPhotos();
        if (photos.length === 0) {
          this.finishAndPrint(ticket.id);
          return;
        }

        const uploads = photos.map((photo) =>
          this.ticketsService.uploadPhoto(ticket.id, new File([photo.blob], 'captura.jpg', { type: 'image/jpeg' }))
        );

        forkJoin(uploads).subscribe({
          next: () => this.finishAndPrint(ticket.id),
          error: () => {
            this.snackBar.open('El ticket se registró, pero una o más fotos no se pudieron subir.', 'Cerrar', {
              duration: 5000
            });
            this.finishAndPrint(ticket.id);
          }
        });
      },
      error: (err) => {
        this.saving.set(false);
        const message = Array.isArray(err?.error) ? err.error[0] : 'No se pudo registrar el ticket.';
        this.snackBar.open(message, 'Cerrar', { duration: 5000 });
      }
    });
  }

  private finishAndPrint(ticketId: number): void {
    this.saving.set(false);
    this.snackBar.open('Ticket registrado correctamente', 'Cerrar', { duration: 3000 });
    this.router.navigate(['/garment-tickets', ticketId, 'print']);
  }
}
