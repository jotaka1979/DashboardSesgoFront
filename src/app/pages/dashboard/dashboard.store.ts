import { Injectable, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Distribution, DistributionResult } from '../../models/distribution';
import { DashboardService } from  '../../services/dashboard.service';

@Injectable({ providedIn: 'root' })
export class DashboardStore {  
  loadingHate = signal(false);
  hateResult = signal<Distribution[]>([]);
  typeResult = signal<Distribution[]>([]);
  intensityResult = signal<Distribution[]>([]);
  languageResult = signal<Distribution[]>([]);
  userResult = signal<Distribution[]>([]);
  hashtagResult = signal<Distribution[]>([]);
  emojiResult = signal<Distribution[]>([]);
  wordResult = signal<Distribution[]>([]);

  error = signal<any | null>(null);
  dataset_id = signal(0);

  constructor(private dashboardService: DashboardService) { }

  loadHateDistribution( payload:any) {    
    this.loadingHate.set(true);
    this.hateResult.set([]);
    this.typeResult.set([]);
    this.intensityResult.set([]);
    this.languageResult.set([]);
    this.userResult.set([]);
    this.hashtagResult.set([]);
    this.emojiResult.set([]);
    this.wordResult.set([]);
    this.error.set(null);


    this.dashboardService.getHateDistribution(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.Response:
            const body = event.body as DistributionResult;
            this.hateResult.set(body.hate);    
            this.typeResult.set(body.type);
            this.intensityResult.set(body.intensity);
            this.languageResult.set(body.language);
            this.userResult.set(body.user);     
            this.hashtagResult.set(body.hashtag);
            this.emojiResult.set(body.emoji);      
            this.wordResult.set(body.word);
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
    this.typeResult.set([]);
    this.intensityResult.set([]);
    this.languageResult.set([]);
    this.userResult.set([]);
    this.hashtagResult.set([]);
    this.emojiResult.set([]);
    this.wordResult.set([]);
    this.error.set(null);
  }
}
