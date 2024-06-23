import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {
    path: 'invitation/:id',
    component: HomeComponent,
    title: 'Faiza & Kamal Wedding💍Invitation',
  },
  {
    path: 'no-invitation',
    component: HomeComponent,
    title: 'Faiza & Kamal Wedding💍Invitation',
  },
  {
    path: '**',
    redirectTo: 'no-invitation',
    pathMatch: 'full',
  },
];
