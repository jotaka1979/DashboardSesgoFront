import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';
import { App } from './app';
import { StatusComponent } from './pages/status/status.component';

export const routes: Routes = [
      { path: 'status', component: StatusComponent },
  { path: '', redirectTo: '/status', pathMatch: 'full' }, // 👈 ruta por defecto
    {  path:'upload', component: UploadComponent}   
];
