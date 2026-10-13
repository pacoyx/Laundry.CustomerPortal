import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { CustomerUserListItem } from '../../core/models/user.models';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule
  ],
  templateUrl: './list.html'
})
export class UsersList implements OnInit {
  readonly loading = signal(true);
  readonly users = signal<CustomerUserListItem[]>([]);
  readonly displayedColumns = ['fullName', 'username', 'role', 'active', 'actions'];

  constructor(
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.usersService.list().subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  editUser(id: number): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  deactivate(user: CustomerUserListItem): void {
    this.usersService.deactivate(user.id).subscribe({
      next: () => {
        this.snackBar.open(`Usuario ${user.fullName} desactivado`, 'Cerrar', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('No se pudo desactivar el usuario', 'Cerrar', { duration: 3000 })
    });
  }

  generateActivationLink(user: CustomerUserListItem): void {
    this.usersService.generateActivationLink(user.id).subscribe({
      next: (res) => {
        navigator.clipboard?.writeText(res.link);
        this.snackBar.open('Enlace de activación copiado al portapapeles', 'Cerrar', { duration: 3000 });
      },
      error: () => this.snackBar.open('No se pudo generar el enlace', 'Cerrar', { duration: 3000 })
    });
  }
}
