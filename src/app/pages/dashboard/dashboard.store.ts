import { Injectable, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { DashboardService } from './dashboard.service';
import { Distribution, DistributionResult } from '../../models/distribution';

@Injectable({ providedIn: 'root' })
export class DashboardStore {  
  loadingHate = signal(false);
  hateResult = signal<Distribution[]>([]);
  error = signal<any | null>(null);
  dataset_id = signal(0);

  constructor(private dashboardService: DashboardService) { }

  loadHateDistribution( dataset_id: number) {
    this.loadingHate.set(true);
    this.hateResult.set([]);
    this.error.set(null);


    this.dashboardService.getHateDistribution({dataset_id}).subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.Response:
            const body = event.body as DistributionResult;
            this.hateResult.set(body.result);          
            this.loadingHate.set(false);
            break;
        }
      },
      error: (err) => {
        console.error(JSON.stringify(err.error));
        this.error.set(err.error);
        this.loadingHate.set(false);
      },
    });
  }  

  reset() {
    this.loadingHate.set(false);
    this.hateResult.set([]);
    this.error.set(null);
  }
}
