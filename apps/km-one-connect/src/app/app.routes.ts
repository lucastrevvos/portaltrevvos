import { Routes } from '@angular/router';
import { AppShellComponent } from './layouts/app-shell/app-shell.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/landing/landing.component').then((m) => m.LandingComponent),
      },
      {
        path: 'cars',
        loadComponent: () =>
          import('./features/cars/cars.component').then((m) => m.CarsComponent),
      },
      {
        path: 'cars/:id',
        loadComponent: () =>
          import('./features/car-details/car-details.component').then(
            (m) => m.CarDetailsComponent,
          ),
      },
      {
        path: 'auth/login',
        loadComponent: () =>
          import('./features/auth/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'auth/register',
        loadComponent: () =>
          import('./features/auth/register.component').then((m) => m.RegisterComponent),
      },
    ],
  },
  {
    path: 'app',
    component: AppShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent,
          ),
      },
      {
        path: 'my-bookings',
        loadComponent: () =>
          import('./features/bookings/bookings.component').then(
            (m) => m.BookingsComponent,
          ),
      },
      {
        path: 'my-cars',
        loadComponent: () =>
          import('./features/my-cars/my-cars.component').then((m) => m.MyCarsComponent),
      },
      {
        path: 'requests',
        loadComponent: () =>
          import('./features/requests/requests.component').then(
            (m) => m.RequestsComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
