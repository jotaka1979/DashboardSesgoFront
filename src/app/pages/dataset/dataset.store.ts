import { Injectable, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { DatasetService } from './dataset.service';

@Injectable({ providedIn: 'root' })
export class DatasetStore {
  // --- Estado reactivo ---
  loading = signal(false);
  progress = signal(0);
  result = signal<any | null>(null);
  error = signal<any | null>(null);

  constructor(private datasetService: DatasetService) {}

  uploadFile(file: File, description: string) {
    this.loading.set(false);
    this.progress.set(0);
    this.result.set(null);
    this.error.set(null);

    this.datasetService.uploadFile(file, description).subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const percent = Math.round((100 * event.loaded) / (event.total ?? 1));
            this.progress.set(percent);
            if (percent>95)
                this.loading.set(true);
            break;
          case HttpEventType.Response:
            this.result.set(event.body);
            this.loading.set(false);
            break;
        }
      },
      error: (err) => {
        console.log(JSON.stringify(err.error))
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  reset() {
    this.loading.set(false);
    this.progress.set(0);
    this.result.set(null);
    this.error.set(null);
  }
}
