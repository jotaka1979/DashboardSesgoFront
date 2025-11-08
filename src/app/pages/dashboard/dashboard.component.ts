import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PieChartComponent } from '../../components/pie-chart/pie-chart.component';
import { BarChartComponent } from '../../components/bar-chart/bar-chart.component';
import { ContainerComponent } from '../../components/container/container.component';

@Component({
  selector: 'app-dashboard',
  imports: [PieChartComponent, ContainerComponent, BarChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
chartData = [
  { label: 'Odio', value: 10, records:100 ,color: '#4CAF50' },
  { label: 'No Odio', value: 90, records: 900,color: '#3688f4ff' },
 
];
}
