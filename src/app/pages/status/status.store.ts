import { Injectable, signal } from '@angular/core';
import { StatusService } from '../../services/status.service';
import { Dataset, DatasetSelect } from '../../models/dataset';

@Injectable({
  providedIn: 'root'
})
export class StatusStore {
  datasets = signal<Dataset[]>([]);
  allDatasets = signal<Dataset[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  dataset = signal<Dataset>({ id: 0, name: "", description: "", status: "", table_name: "" });

  constructor(private statusService: StatusService) { }

  loadDatasets() {
    this.loading.set(true);
    this.error.set(null);

    this.statusService.getDatasets().subscribe({
      next: (data) => {
        this.datasets.set((data as unknown as DatasetSelect).results);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al obtener los datasets');
        this.loading.set(false);
      }
    });
  }

  loadAllDatasets() {
    this.statusService.getAllDatasets().subscribe({
      next: (data) => {
        this.allDatasets.set((data as unknown as DatasetSelect).results);
      },
      error: (err) => {
        this.error.set('Error al obtener los datasets');
        this.loading.set(false);
      }
    });
  }

  loadDataset(dataset_id: number) {
    this.statusService.getDataset(dataset_id).subscribe({
      next: (data) => {       
        this.dataset.set((data as unknown as Dataset));
      },
      error: (err) => {
        this.error.set('Error al obtener los datasets');
      }
    });
  }
}
