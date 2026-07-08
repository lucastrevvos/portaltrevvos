import { Routes } from '@angular/router';
import { HomePageComponent } from './features/portal/pages/home-page/home-page.component';

export const routes: Routes = [
  {
  path: 'admin/leads/:id',
  loadComponent: () =>
    import('./features/admin/pages/admin-lead-details/admin-lead-details.component').then(
      (m) => m.AdminLeadDetailsComponent,
    ),
  },
  {
    path: 'admin/leads',
    loadComponent: () =>
      import('./features/admin/pages/admin-leads/admin-leads.component').then(
        (m) => m.AdminLeadsComponent
      ),
  },
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
