import { Routes } from '@angular/router';
import { DatasetComponent } from './pages/dataset/dataset.component';
import { App } from './app';
import { StatusComponent } from './pages/status/status.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';


export const routes: Routes = [
  { path: 'status', component: StatusComponent },
  { path: '', redirectTo: '/status', pathMatch: 'full' },
  { path: 'dataset', component: DatasetComponent },
  { path: 'dashboard/:dataset_id', component: DashboardComponent },

];
