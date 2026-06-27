import { Routes } from '@angular/router';
import { HomePageComponent } from './features/portal/pages/home-page/home-page.component';

export const routes: Routes = [
  {
    path: 'forge',
    loadComponent: () =>
      import('./features/forge/pages/forge-landing/forge-landing.component').then(
        (m) => m.ForgeLandingComponent,
      ),
  },
  {
    path: '',
    component: HomePageComponent,
  },
];
