import { Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomerUserListItem } from '../../core/models/user.models';
import { UsersService } from '../../core/services/users.service';
import { ResetPasswordDialog } from '../reset-password-dialog/reset-password-dialog';

const RESET_PASSWORD_ERROR_MESSAGES: Record<number, string> = {
  400: 'Este usuario no tiene un correo registrado. Edítalo antes de resetear la contraseña.',
  401: 'No tienes permisos suficientes para realizar esta acción.',
  403: 'No tienes permisos suficientes para realizar esta acción.',
  404: 'Usuario no encontrado.',
  500: 'No se pudo enviar el correo. Intenta de nuevo en unos minutos.'
};

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatTooltipModule
  ],
  templateUrl: './list.html'
})
export class UsersList implements OnInit {
  readonly loading = signal(true);
  readonly users = signal<CustomerUserListItem[]>([]);
  readonly resettingId = signal<number | null>(null);
  readonly displayedColumns = ['fullName', 'username', 'role', 'active', 'actions'];

  constructor(
    private readonly usersService: UsersService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
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

  resetPassword(user: CustomerUserListItem): void {
    this.dialog
      .open(ResetPasswordDialog, { data: { fullName: user.fullName, email: user.email } })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.doResetPassword(user);
        }
      });
  }

  private doResetPassword(user: CustomerUserListItem): void {
    this.resettingId.set(user.id);
    this.usersService.resetPassword(user.id).subscribe({
      next: (res) => {
        this.resettingId.set(null);
        this.snackBar.open(
          `Se generó una nueva contraseña y se envió al correo registrado del usuario (${res.email}). Solo el usuario podrá verla revisando su bandeja de entrada.`,
          'Cerrar',
          { duration: 6000 }
        );
      },
      error: (err: HttpErrorResponse) => {
        this.resettingId.set(null);
        const message = RESET_PASSWORD_ERROR_MESSAGES[err.status] ?? 'No se pudo resetear la contraseña.';

        if (err.status === 500) {
          this.snackBar
            .open(message, 'Reintentar', { duration: 8000 })
            .onAction()
            .subscribe(() => this.doResetPassword(user));
        } else {
          this.snackBar.open(message, 'Cerrar', { duration: 5000 });
        }
      }
    });
  }
}
