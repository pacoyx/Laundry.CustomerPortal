import { Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-webcam-capture',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './webcam-capture.html',
  styleUrl: './webcam-capture.scss'
})
export class WebcamCapture implements OnDestroy {
  @ViewChild('video') videoRef?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasRef?: ElementRef<HTMLCanvasElement>;

  @Output() readonly photoCaptured = new EventEmitter<Blob>();

  readonly streaming = signal(false);
  readonly starting = signal(false);

  private stream: MediaStream | null = null;

  constructor(private readonly snackBar: MatSnackBar) {}

  async start(): Promise<void> {
    if (!navigator.mediaDevices?.getUserMedia) {
      this.snackBar.open('Este navegador no permite acceder a la cámara.', 'Cerrar', { duration: 4000 });
      return;
    }

    this.starting.set(true);
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { width: 1280, height: 720 } });
      if (this.videoRef) {
        this.videoRef.nativeElement.srcObject = this.stream;
        await this.videoRef.nativeElement.play();
      }
      this.streaming.set(true);
    } catch {
      this.snackBar.open('No se pudo acceder a la cámara web. Verifica los permisos del navegador.', 'Cerrar', {
        duration: 5000
      });
    } finally {
      this.starting.set(false);
    }
  }

  capture(): void {
    if (!this.videoRef || !this.canvasRef) {
      return;
    }

    const video = this.videoRef.nativeElement;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        this.photoCaptured.emit(blob);
      }
    }, 'image/jpeg', 0.9);
  }

  stop(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
    this.stream = null;
    this.streaming.set(false);
  }

  ngOnDestroy(): void {
    this.stop();
  }
}
