import { Injectable, signal } from '@angular/core';
import { StatusService } from './status.service';
import { Dataset, DatasetSelect } from '../../models/dataset';

@Injectable({
  providedIn: 'root'
})
export class StatusStore {
  datasets = signal<Dataset[]>([]);
  allDatasets = signal<Dataset[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private statusService: StatusService) {}

  loadDatasets() {
    this.loading.set(true);
    this.error.set(null);

    this.statusService.getDatasets().subscribe({
      next: (data) => {
        console.log(data)
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
        console.log(data)
        this.allDatasets.set((data as unknown as DatasetSelect).results);
      },
      error: (err) => {
        this.error.set('Error al obtener los datasets');
        this.loading.set(false);
      }
    });
  }
}
