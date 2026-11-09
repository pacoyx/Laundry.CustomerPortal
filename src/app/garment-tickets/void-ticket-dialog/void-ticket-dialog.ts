import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-void-ticket-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule],
  templateUrl: './void-ticket-dialog.html'
})
export class VoidTicketDialog {
  readonly reasonControl = new FormControl('', { nonNullable: true, validators: [Validators.required] });

  constructor(private readonly dialogRef: MatDialogRef<VoidTicketDialog>) {}

  confirm(): void {
    if (this.reasonControl.invalid) {
      this.reasonControl.markAsTouched();
      return;
    }
    this.dialogRef.close(this.reasonControl.value);
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
