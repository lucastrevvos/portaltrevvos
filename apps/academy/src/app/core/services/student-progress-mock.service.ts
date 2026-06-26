import { computed, Injectable, signal } from '@angular/core';
import { studentDashboardMock } from '../data/academy.mock-data';
import { AcademyMockService } from './academy-mock.service';
import { AiMode, StudentDashboard } from '../models/academy.models';

@Injectable({ providedIn: 'root' })
export class StudentProgressMockService {
  private readonly dashboardState = signal<StudentDashboard>({ ...studentDashboardMock });
  readonly dashboard = this.dashboardState.asReadonly();

  readonly allLessons = computed(() => this.academy.getCourse().modules.flatMap((module) => module.lessons));
  readonly completedLessons = computed(() => this.allLessons().filter((lesson) => lesson.status === 'completed').length);
  readonly progressPercent = computed(() => Math.round((this.completedLessons() / this.allLessons().length) * 100));
  readonly pendingExercises = computed(() =>
    this.allLessons()
      .flatMap((lesson) => lesson.exercises)
      .filter((exercise) => exercise.required && exercise.status !== 'approved'),
  );

  constructor(private readonly academy: AcademyMockService) {}

  setAiMode(mode: AiMode): void {
    this.dashboardState.update((dashboard) => ({ ...dashboard, aiMode: mode }));
  }

  setTokenBalance(tokenBalance: number): void {
    this.dashboardState.update((dashboard) => ({ ...dashboard, tokenBalance }));
  }
}
