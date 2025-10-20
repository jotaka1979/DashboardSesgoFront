import { Routes } from '@angular/router';
import { DatasetComponent } from './pages/dataset/dataset.component';
import { App } from './app';
import { StatusComponent } from './pages/status/status.component';

export const routes: Routes = [
      { path: 'status', component: StatusComponent },
  { path: '', redirectTo: '/status', pathMatch: 'full' }, // 👈 ruta por defecto
    {  path:'dataset', component: DatasetComponent}   
];
