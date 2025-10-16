import { Routes } from '@angular/router';
import { CargarComponent } from './pages/cargar/cargar.component';
import { App } from './app';

export const routes: Routes = [
    { path: '', component: App }, 
    {  path:'cargar', component: CargarComponent}   
];
