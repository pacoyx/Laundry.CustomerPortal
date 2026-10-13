import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Permission } from '../../core/models/auth.models';
import { UsersService } from '../../core/services/users.service';

const PERMISSION_OPTIONS: { key: Permission; label: string }[] = [
  { key: 'guides.view', label: 'Ver Guías' },
  { key: 'invoices.view', label: 'Ver Facturas' },
  { key: 'reports.view', label: 'Ver Reportes' },
  { key: 'users.manage', label: 'Administrar Usuarios' }
];

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './form.html'
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly snackBar = inject(MatSnackBar);

  readonly permissionOptions = PERMISSION_OPTIONS;
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly isEdit = signal(false);
  private userId: number | null = null;

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    permissions: this.fb.group(
      PERMISSION_OPTIONS.reduce(
        (acc, option) => ({ ...acc, [option.key]: [false] }),
        {} as Record<string, boolean[]>
      )
    )
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = Number(idParam);
      this.isEdit.set(true);
      this.form.get('username')?.disable();
      this.loadExistingUser(this.userId);
    }
  }

  private loadExistingUser(id: number): void {
    this.loading.set(true);
    this.usersService.list().subscribe({
      next: (users) => {
        const user = users.find((u) => u.id === id);
        if (user) {
          this.form.patchValue({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            role: user.role
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  private getSelectedPermissions(): Permission[] {
    const permissionsValue = this.form.get('permissions')!.value as Record<string, boolean>;
    return PERMISSION_OPTIONS.map((o) => o.key).filter((key) => permissionsValue[key]);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { fullName, username, email, role } = this.form.getRawValue();
    const permissions = this.getSelectedPermissions();

    const request$ = this.isEdit() && this.userId
      ? this.usersService.update(this.userId, { fullName: fullName!, email: email!, role: role!, permissions })
      : this.usersService.create({ fullName: fullName!, username: username!, email: email!, role: role!, permissions });

    request$.subscribe({
      next: () => {
        this.saving.set(false);
        this.snackBar.open('Usuario guardado correctamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/users']);
      },
      error: () => {
        this.saving.set(false);
        this.snackBar.open('No se pudo guardar el usuario', 'Cerrar', { duration: 3000 });
      }
    });
  }
}
