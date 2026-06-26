import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { LessonStatusBadgeComponent } from '../../../shared/lesson-status-badge/lesson-status-badge.component';

@Component({
  selector: 'app-course-progress-page',
  imports: [RouterLink, LessonStatusBadgeComponent],
  templateUrl: './course-progress-page.component.html',
  styleUrl: './course-progress-page.component.scss',
})
export class CourseProgressPageComponent {
  private readonly academy = inject(AcademyMockService);
  readonly course = this.academy.course;

  moduleProgress(moduleId: string): number {
    const module = this.course().modules.find((item) => item.id === moduleId);
    if (!module) return 0;
    const completed = module.lessons.filter((lesson) => lesson.status === 'completed').length;
    return Math.round((completed / module.lessons.length) * 100);
  }
}
