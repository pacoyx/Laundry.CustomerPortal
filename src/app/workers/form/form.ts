import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CompanyWorkersService } from '../../core/services/company-workers.service';

@Component({
  selector: 'app-worker-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './form.html'
})
export class WorkerForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workersService = inject(CompanyWorkersService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly isEdit = signal(false);
  readonly loadError = signal(false);
  private workerId: number | null = null;

  readonly form = this.fb.group({
    code: ['', Validators.required],
    fullName: ['', Validators.required],
    area: ['', Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.workerId = Number(idParam);
      this.isEdit.set(true);
      this.loadWorker();
    }
  }

  private loadWorker(): void {
    this.loading.set(true);
    this.workersService.list().subscribe({
      next: (workers) => {
        const worker = workers.find((w) => w.id === this.workerId);
        if (worker) {
          this.form.patchValue({ code: worker.code, fullName: worker.fullName, area: worker.area });
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.loadError.set(true);
        this.form.disable();
      }
    });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { code, fullName, area } = this.form.getRawValue();
    const request = { code: code!, fullName: fullName!, area: area! };

    const request$ = this.isEdit() && this.workerId
      ? this.workersService.update(this.workerId, request)
      : this.workersService.create(request);

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Trabajador guardado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/workers']);
      },
      error: (err) => {
        this.saving.set(false);
        const message = Array.isArray(err?.error) ? err.error[0] : 'No se pudo guardar el trabajador';
        this.snackBar.open(message, 'Cerrar', { duration: 4000 });
      }
    });
  }
}
