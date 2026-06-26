import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { ForgeMockService } from '../../../core/services/forge-mock.service';
import { StudentProgressMockService } from '../../../core/services/student-progress-mock.service';

@Component({
  selector: 'app-student-dashboard-page',
  imports: [RouterLink],
  templateUrl: './student-dashboard-page.component.html',
})
export class StudentDashboardPageComponent {
  private readonly academy = inject(AcademyMockService);
  private readonly progress = inject(StudentProgressMockService);
  private readonly forge = inject(ForgeMockService);
  readonly dashboard = this.progress.dashboard;
  readonly course = this.academy.course;
  readonly progressPercent = this.progress.progressPercent;
  readonly pendingExercises = this.progress.pendingExercises;
  readonly lastValidation = this.forge.lastValidation;
  readonly currentLesson = computed(() => this.academy.findLesson(this.dashboard().currentLessonSlug));
  readonly nextLesson = computed(() => {
    const current = this.currentLesson();
    const lessons = this.course().modules.flatMap((module) => module.lessons).sort((a, b) => a.order - b.order);
    const index = lessons.findIndex((lesson) => lesson.id === current?.id);
    return lessons[index + 1];
  });

}
