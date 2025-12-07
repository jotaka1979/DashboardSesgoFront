import { ChangeDetectionStrategy, Component, computed, OnInit, signal, effect, inject } from '@angular/core';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { WordCloudComponent } from '../../components/word-cloud/word-cloud.component';
import { ContainerComponent } from '../../components/container/container.component';
import { HateFilterComponent } from '../../components/hate-filter/hate-filter.component';
import { HateTypeFilterComponent } from '../../components/hate-type-filter/hate-type-filter.component';


import { DashboardStore } from './dashboard.store';
import { ActivatedRoute, Router } from '@angular/router';
import { Distribution } from '../../models/distribution';
import { StatusStore } from '../status/status.store';
import { DatasetStore } from '../dataset/dataset.store';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { DatasetListModalComponent } from '../../components/dataset-list-modal/dataset-list-modal';
import { ProcessService } from '../../services/process.service';

@Component({
  selector: 'app-dashboard',
  imports: [PieChartComponent, ContainerComponent, BarChartComponent, WordCloudComponent, HateFilterComponent, HateTypeFilterComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  datasetId = signal<number>(-1)
  hateData = signal<Distribution[]>([]);
  typeData = signal<Distribution[]>([]);
  intensityData = signal<Distribution[]>([]);
  languageData = signal<Distribution[]>([]);
  userData = signal<Distribution[]>([]);
  hashtagData = signal<Distribution[]>([]);
  emojiData = signal<Distribution[]>([]);
  wordData = signal<Distribution[]>([]);

  hateFilter = signal<boolean | null>(null);
  hateTypeFilter = signal<string | null>(null);
  languageFilter= signal<string>("OTHER");

  private statusStore = inject(StatusStore);

  constructor(public store: DashboardStore, private route: ActivatedRoute, public datasetStore: DatasetStore, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private processService: ProcessService) {
    effect(() => {
      const value = this.hateFilter();
    });

    effect(() => {
      const data = this.store.hateResult();
      this.hateData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Odio' ? '#e39f91ff' : '#6da8f6ff',
        }))
      );
    });

    effect(() => {
      const data = this.store.typeResult();
      this.typeData.set(
        data.map(item => ({
          ...item,
          color: '#f0b342ff',
        }))
      );
    });

    effect(() => {
      const data = this.store.intensityResult();
      this.intensityData.set(
        data.map(item => ({
          ...item,
          color: '#dbb0e6ff',
        }))
      );      
    });

    effect(() => {
      const data = this.store.languageResult();
      this.languageData.set(
        data.map(item => ({
          ...item,
          color:   item.label === 'Otros' ? '#959895ff' : (this.languageFilter()!="OTHER" ? (item.code==this.languageFilter() ? '#10B981' : '#A7F3D0') : '#6cb492ff'),
           selected:  (this.languageFilter()!="OTHER" && item.code==this.languageFilter() ? true : false),
        }))
      );
    });

    effect(() => {
      const data = this.store.userResult();
      this.userData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Otros' ? '#959895ff' : '#709cfaff',
        }))
      );
    });

    effect(() => {
      const data = this.store.hashtagResult();
      this.hashtagData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Otros' ? '#959895ff' : '#f359a1ff',
        }))
      );
    });

    effect(() => {
      const data = this.store.emojiResult();
      this.emojiData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Otros' ? '#959895ff' : '#ccae4eff',
        }))
      );
    });

    effect(() => {
      const data = this.store.wordResult();      
      this.wordData.set(
        data.map(item => ({
          ...item,
        }))
      );
    });

    effect(() => {
      const hate = this.hateFilter();
      const hatetype = this.hateTypeFilter();
      const datasetId = this.datasetId();

      if (!datasetId) return;

      this.loadData();
    });
  }

  dataset = this.statusStore.dataset;
  public processEnabled = computed(() => this.dataset().status !== 'EN PROCESO');

  loadData() {
    if (this.hateFilter() === false)
      this.hateTypeFilter.set(null)

    let payload :any = { "dataset_id": this.datasetId(), "hate": this.hateFilter(), "hatetype": this.hateTypeFilter() }
    if (this.languageFilter()!="OTHER")
      payload.language = this.languageFilter();    
    this.store.loadHateDistribution(payload);
    this.statusStore.loadDataset(this.datasetId());
    this.statusStore.loadAllDatasets();
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('dataset_id');
      if (id) {
        this.datasetId.set(+id);
      }
    });
  }

  onProcess(): void {
    this.processService.processDataset(this.datasetId()).subscribe();

    const snack = this.snackBar.open('Acción de procesamiento iniciada correctamente', 'Ir al inicio', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
    });

    let actionClicked = false;

    snack.onAction().subscribe(() => {
      actionClicked = true;
      this.router.navigate(['/status']);
    });

    snack.afterDismissed().subscribe(() => {
      if (!actionClicked) {
        this.router.navigate(['/status']);
      }
    });
  }

  onDelete(): void {
    const confirmed = confirm('¿Estás seguro de que deseas eliminar este dataset?');
    if (!confirmed) return;
    const id = this.dataset().id;
    if (id != 0) {
      this.datasetStore.deleteDataset(id);
      const snack = this.snackBar.open('Dataset eliminado correctamente', 'Ir al inicio', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
      });

      let actionClicked = false;

      snack.onAction().subscribe(() => {
        actionClicked = true;
        this.router.navigate(['/status']);
      });

      snack.afterDismissed().subscribe(() => {
        if (!actionClicked) {
          this.router.navigate(['/status']);
        }
      });
    }
  }

  openDatasetModal() {
    const dialogRef = this.dialog.open(DatasetListModalComponent, {
      width: '1200px',
      maxHeight: '80vh',
      data: this.statusStore.allDatasets(),
      panelClass: 'custom-dialog-container'
    });

    dialogRef.afterClosed().subscribe((selectedDataset) => {
      if (selectedDataset) {
        this.router.navigate([`/dashboard/${selectedDataset.id}`]);
      }
    });
  }

  onBarClicked(item: Distribution) {
    this.languageFilter.set(item.code);
  }

}
