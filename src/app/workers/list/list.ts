import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CompanyWorkerListItem } from '../../core/models/company-worker.models';
import { CompanyWorkersService } from '../../core/services/company-workers.service';

@Component({
  selector: 'app-workers-list',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatMenuModule, MatProgressSpinnerModule, MatTableModule],
  templateUrl: './list.html'
})
export class WorkersList implements OnInit {
  readonly loading = signal(true);
  readonly workers = signal<CompanyWorkerListItem[]>([]);
  readonly displayedColumns = ['code', 'fullName', 'area', 'active', 'actions'];

  constructor(
    private readonly workersService: CompanyWorkersService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.workersService.list().subscribe({
      next: (workers) => {
        this.workers.set(workers);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  editWorker(id: number): void {
    this.router.navigate(['/workers', id, 'edit']);
  }

  toggleActive(worker: CompanyWorkerListItem): void {
    this.workersService.toggleActive(worker.id).subscribe({
      next: (res) => {
        this.snackBar.open(
          res.isActive ? `Trabajador ${worker.fullName} activado` : `Trabajador ${worker.fullName} desactivado`,
          'Cerrar',
          { duration: 3000 }
        );
        this.load();
      },
      error: () => this.snackBar.open('No se pudo actualizar el estado del trabajador', 'Cerrar', { duration: 3000 })
    });
  }
}
