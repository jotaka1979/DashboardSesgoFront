import { Injectable, signal } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { DatasetService } from '../../services/dataset.service';
import { DatasetUploadResult } from '../../models/dataset.upload.result';
import { Observable } from 'rxjs';
import { Dataset } from '../../models/dataset';

@Injectable({ providedIn: 'root' })
export class DatasetStore {
  // --- Estado reactivo ---
  loading = signal(false);
  progress = signal(0);
  result = signal<DatasetUploadResult | null>(null);
  error = signal<any | null>(null);
  dataset_id = signal(0);

  constructor(private datasetService: DatasetService) { }

  uploadFile(file: File, description: string, dataset_id: number) {
    this.loading.set(false);
    this.progress.set(0);
    this.result.set(null);
    this.error.set(null);

    const request$: Observable<HttpEvent<any>> =
      dataset_id === 0
        ? this.datasetService.uploadFile(file, description)
        : this.datasetService.reuploadFile(file, description, dataset_id);

    request$.subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            const percent = Math.round((100 * event.loaded) / (event.total ?? 1));
            this.progress.set(percent);
            if (percent > 95) this.loading.set(true);
            break;

          case HttpEventType.Response:
            const body = event.body as DatasetUploadResult;
            this.result.set(body);
            this.dataset_id.set(body?.dataset_id ?? 0);
            this.loading.set(false);
            break;
        }
      },
      error: (err) => {
        console.error(JSON.stringify(err.error));
        this.error.set(err.error);
        this.loading.set(false);
      },
    });
  }

  deleteDataset(dataset_id: number) {
    this.datasetService.deleteDataset(dataset_id).subscribe({
      next: event => {
        if (event.type === HttpEventType.Response) {
          this.result.set(null);
          this.dataset_id.set(0);
        }
      },
      error: err => {
        console.error('Error al eliminar:', err);
      }
    });
  }

  reset() {
    this.loading.set(false);
    this.progress.set(0);
    this.result.set(null);
    this.error.set(null);
  }
}
