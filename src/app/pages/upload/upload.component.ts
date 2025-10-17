import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HttpClientModule, HttpEventType } from '@angular/common/http';
import { UploadService } from '../../services/upload.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-upload',
  imports: [CommonModule, HttpClientModule],
  templateUrl: 'upload.html',
  styleUrl: './upload.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UploadComponent {
  selectedFile?: File;
  uploadProgress: number = 0;
  uploadComplete: boolean = false;

  constructor(private uploadService: UploadService) { }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.uploadProgress = 0;
    this.uploadComplete = false;
  }

  onUpload(): void {
    if (!this.selectedFile) return;

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadComplete = true;
          console.log('✅ Respuesta del servidor:', event.body);
        }
      },
      error: (err) => {
        console.error('❌ Error al subir archivo:', err);
      }
    });
  }
}
