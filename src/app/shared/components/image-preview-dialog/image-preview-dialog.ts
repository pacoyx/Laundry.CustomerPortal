import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

export interface ImagePreviewDialogData {
  title: string;
  imageUrl: string;
  onDownload: () => void;
}

@Component({
  selector: 'app-image-preview-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule],
  templateUrl: './image-preview-dialog.html',
  styleUrl: './image-preview-dialog.scss'
})
export class ImagePreviewDialog {
  constructor(
    public readonly dialogRef: MatDialogRef<ImagePreviewDialog>,
    @Inject(MAT_DIALOG_DATA) public readonly data: ImagePreviewDialogData
  ) {}

  download(): void {
    this.data.onDownload();
  }
}
