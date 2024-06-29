import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'invitation/:id',
    component: HomeComponent,
    title: 'Faiza & Kamal Wedding💍Invitation',
  },
  {
    path: 'announcement',
    component: HomeComponent,
    title: 'Faiza & Kamal Wedding💍Invitation',
  },
  {
    path: '**',
    redirectTo: 'announcement',
    pathMatch: 'full',
  },
];
