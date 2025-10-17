import { Routes } from '@angular/router';
import { UploadComponent } from './pages/upload/upload.component';
import { App } from './app';

export const routes: Routes = [
    { path: '', component: App }, 
    {  path:'upload', component: UploadComponent}   
];
