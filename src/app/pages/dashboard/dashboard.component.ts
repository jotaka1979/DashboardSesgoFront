import { ChangeDetectionStrategy, Component, computed, OnInit, signal, effect, inject } from '@angular/core';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { ContainerComponent } from '../../components/container/container.component';
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
  imports: [PieChartComponent, ContainerComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  datasetId: number = 0
  hateData = signal<Distribution[]>([]);
  typeData = signal<Distribution[]>([]);
  intensityData = signal<Distribution[]>([]);

  private statusStore = inject(StatusStore);

  constructor(public store: DashboardStore, private route: ActivatedRoute, public datasetStore: DatasetStore, private snackBar: MatSnackBar, private router: Router, private dialog: MatDialog, private processService: ProcessService) {
    effect(() => {
      const data = this.store.hateResult();
      this.hateData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Odio' ? '#4CAF50' : '#3688f4',
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
          color: '#de85f5ff',
        }))
      );
    });
  }

  dataset = this.statusStore.dataset;
  public processEnabled = computed(() => this.dataset().status !== 'EN PROCESO');

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('dataset_id');
      if (id) {
        this.datasetId = +id;

        this.store.loadHateDistribution(this.datasetId);
        this.statusStore.loadDataset(this.datasetId);
        this.statusStore.loadAllDatasets();
      }
    });
  }

  onProcess(): void {
    this.processService.processDataset(this.datasetId).subscribe();

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
    console.log("liminar", this.dataset().id)
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
        console.log('Dataset seleccionado:', selectedDataset);
      }
    });
  }
}
