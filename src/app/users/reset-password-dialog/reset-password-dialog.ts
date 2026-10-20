import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

export interface ResetPasswordDialogData {
  fullName: string;
  email: string;
}

@Component({
  selector: 'app-reset-password-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './reset-password-dialog.html'
})
export class ResetPasswordDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public readonly data: ResetPasswordDialogData) {}
}
