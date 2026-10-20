import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerRoleApi } from '../../core/models/user.models';
import { UsersService } from '../../core/services/users.service';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule
  ],
  templateUrl: './form.html'
})
export class UserForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  private readonly snackBar = inject(MatSnackBar);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly isEdit = signal(false);
  readonly roleOptions = signal<CustomerRoleApi[]>([]);
  readonly loadError = signal(false);
  private userId: number | null = null;

  readonly form = this.fb.group({
    fullName: ['', Validators.required],
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    roleId: [null as number | null, Validators.required]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.userId = Number(idParam);
      this.isEdit.set(true);
      this.form.get('username')?.disable();
    }
    this.loadFormData();
  }

  roleDescription(roleId: number | null): string | null {
    return this.roleOptions().find((role) => role.id === roleId)?.description ?? null;
  }

  private loadFormData(): void {
    this.loading.set(true);
    this.loadError.set(false);

    forkJoin({
      roles: this.usersService.listRoles(),
      users: this.userId ? this.usersService.list() : of(null)
    }).subscribe({
      next: ({ roles, users }) => {
        this.roleOptions.set(roles);

        const user = users?.find((u) => u.id === this.userId);
        if (user) {
          this.form.patchValue({
            fullName: user.fullName,
            username: user.username,
            email: user.email,
            roleId: user.roleId
          });
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
    const { fullName, username, email, roleId } = this.form.getRawValue();

    const request$ = this.isEdit() && this.userId
      ? this.usersService.update(this.userId, { fullName: fullName!, email: email!, customerRoleId: roleId! })
      : this.usersService.create({
          fullName: fullName!,
          userName: username!,
          email: email!,
          customerRoleId: roleId!
        });

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
