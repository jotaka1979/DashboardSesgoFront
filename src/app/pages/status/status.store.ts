import { Injectable, signal } from '@angular/core';
import { StatusService } from './status.service';

@Injectable({
  providedIn: 'root'
})
export class StatusStore {
  // Estado con signals
  datasets = signal<any[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(private statusService: StatusService) {}

  // Método para cargar datasets
  loadDatasets() {
    this.loading.set(true);
    this.error.set(null);

    this.statusService.getDatasets().subscribe({
      next: (data) => {
        this.datasets.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set('Error al obtener los datasets');
        this.loading.set(false);
      }
    });
  }
}
