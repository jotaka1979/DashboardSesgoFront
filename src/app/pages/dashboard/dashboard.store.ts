import { Injectable, signal } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { DateRangeResult, Distribution, DistributionResult } from '../../models/distribution';
import { DashboardService } from '../../services/dashboard.service';
import { MessageLength } from '../../models/MessageLength';

@Injectable({ providedIn: 'root' })
export class DashboardStore {
  loadingHate = signal(false);
  hateResult = signal<Distribution[]>([]);
  typeResult = signal<Distribution[]>([]);
  subtypeResult = signal<Distribution[]>([]);
  intensityResult = signal<Distribution[]>([]);
  languageResult = signal<Distribution[]>([]);
  userResult = signal<Distribution[]>([]);
  hashtagResult = signal<Distribution[]>([]);
  emojiResult = signal<Distribution[]>([]);
  wordResult = signal<Distribution[]>([]);
  entityResult = signal<Distribution[]>([]);
  cleanedLengthResult = signal<MessageLength>({ median: 0, mean: 0, std: 0, histogram: [] });
  rawLengthResult = signal<MessageLength>({ median: 0, mean: 0, std: 0, histogram: [] });
  error = signal<any | null>(null);
  dataset_id = signal(0);
  minDate = signal("");
  maxDate = signal("");

  constructor(private dashboardService: DashboardService) { }

  loadDateRange(payload: any) {
    this.dashboardService.getDateRange(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.Response:
            const body = event.body as DateRangeResult;
            this.minDate.set(body.min);
            this.maxDate.set(body.max);
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

  loadHateDistribution(payload: any) {
    this.loadingHate.set(true);
    this.hateResult.set([]);
    this.typeResult.set([]);
    this.subtypeResult.set([]);
    this.intensityResult.set([]);
    this.languageResult.set([]);
    this.userResult.set([]);
    this.hashtagResult.set([]);
    this.emojiResult.set([]);
    this.wordResult.set([]);
    this.entityResult.set([]);
    this.cleanedLengthResult.set({ median: 0, mean: 0, std: 0, histogram: [] });
    this.rawLengthResult.set({ median: 0, mean: 0, std: 0, histogram: [] });

    this.error.set(null);


    this.dashboardService.getHateDistribution(payload).subscribe({
      next: (event) => {
        switch (event.type) {
          case HttpEventType.Response:
            console.log("termino")
            const body = event.body as DistributionResult;
            this.hateResult.set(body.hate);
            this.typeResult.set(body.type);
            this.subtypeResult.set(body.subtype);
            this.intensityResult.set(body.intensity);
            this.languageResult.set(body.language);
            this.userResult.set(body.user);
            this.hashtagResult.set(body.hashtag);
            this.emojiResult.set(body.emoji);
            this.wordResult.set(body.word);
            this.entityResult.set(body.entity);
            this.cleanedLengthResult.set(body.cleanedlength);
            this.rawLengthResult.set(body.rawlength);
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
    this.subtypeResult.set([]);
    this.intensityResult.set([]);
    this.languageResult.set([]);
    this.userResult.set([]);
    this.hashtagResult.set([]);
    this.emojiResult.set([]);
    this.wordResult.set([]);
    this.entityResult.set([]);
    this.cleanedLengthResult.set({ mean: 0, std: 0, median: 0, histogram: [] });
    this.rawLengthResult.set({ mean: 0, std: 0, median: 0, histogram: [] });
    this.error.set(null);
  }
}
