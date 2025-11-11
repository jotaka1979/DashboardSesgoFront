import { ChangeDetectionStrategy, Component, computed, OnInit, signal, effect } from '@angular/core';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { ContainerComponent } from '../../components/container/container.component';
import { DashboardStore } from './dashboard.store';
import { ActivatedRoute } from '@angular/router';
import { Distribution } from '../../models/distribution';

@Component({
  selector: 'app-dashboard',
  imports: [PieChartComponent, ContainerComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {

  datasetId: number = 0
  chartData = signal<Distribution[]>([]);

  constructor(public store: DashboardStore, private route: ActivatedRoute) {
   effect(() => {      
      const data = this.store.hateResult();      
      this.chartData.set(
        data.map(item => ({
          ...item,
          color: item.label === 'Odio' ? '#4CAF50' : '#3688f4',
        }))
      );      
    });
  }

  ngOnInit() {    
    this.route.paramMap.subscribe(params => {
      const id = params.get('dataset_id');
      if (id) {
        this.datasetId = +id;

        this.store.loadHateDistribution(this.datasetId);
      }
    });
  }
}
