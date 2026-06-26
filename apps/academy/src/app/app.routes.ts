import { Routes } from '@angular/router';
import { AcademyAppShellComponent } from './layouts/academy-app-shell/academy-app-shell.component';
import { PublicLayoutComponent } from './layouts/public-layout/public-layout.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'academy' },
  {
    path: 'academy',
    component: PublicLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/public/academy-landing-page/academy-landing-page.component').then(
            (m) => m.AcademyLandingPageComponent,
          ),
      },
      {
        path: 'engenharia-software-2026',
        loadComponent: () =>
          import('./features/public/course-public-page/course-public-page.component').then(
            (m) => m.CoursePublicPageComponent,
          ),
      },
      {
        path: 'metodologia-forge',
        loadComponent: () =>
          import('./features/public/forge-methodology-page/forge-methodology-page.component').then(
            (m) => m.ForgeMethodologyPageComponent,
          ),
      },
      {
        path: 'ia-local-online',
        loadComponent: () =>
          import('./features/public/ai-pricing-page/ai-pricing-page.component').then(
            (m) => m.AiPricingPageComponent,
          ),
      },
    ],
  },
  {
    path: 'academy/app',
    component: AcademyAppShellComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/app/student-dashboard-page/student-dashboard-page.component').then(
            (m) => m.StudentDashboardPageComponent,
          ),
      },
      { path: 'courses', redirectTo: 'courses/engenharia-software-2026', pathMatch: 'full' },
      {
        path: 'courses/engenharia-software-2026',
        loadComponent: () =>
          import('./features/app/course-progress-page/course-progress-page.component').then(
            (m) => m.CourseProgressPageComponent,
          ),
      },
      {
        path: 'lessons/:lessonSlug',
        loadComponent: () =>
          import('./features/app/lesson-reader-page/lesson-reader-page.component').then(
            (m) => m.LessonReaderPageComponent,
          ),
      },
      {
        path: 'exercises/:exerciseSlug',
        loadComponent: () =>
          import('./features/app/exercise-page/exercise-page.component').then(
            (m) => m.ExercisePageComponent,
          ),
      },
      {
        path: 'tokens',
        loadComponent: () =>
          import('./features/app/token-wallet-page/token-wallet-page.component').then(
            (m) => m.TokenWalletPageComponent,
          ),
      },
      {
        path: 'forge',
        loadComponent: () =>
          import('./features/app/forge-connection-page/forge-connection-page.component').then(
            (m) => m.ForgeConnectionPageComponent,
          ),
      },
    ],
  },
  { path: '**', redirectTo: 'academy' },
];
