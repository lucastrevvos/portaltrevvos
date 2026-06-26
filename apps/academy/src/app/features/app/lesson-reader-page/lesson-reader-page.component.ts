import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { ExerciseStatusBadgeComponent } from '../../../shared/exercise-status-badge/exercise-status-badge.component';
import { LessonStatusBadgeComponent } from '../../../shared/lesson-status-badge/lesson-status-badge.component';

@Component({
  selector: 'app-lesson-reader-page',
  imports: [RouterLink, ExerciseStatusBadgeComponent, LessonStatusBadgeComponent],
  templateUrl: './lesson-reader-page.component.html',
  styleUrl: './lesson-reader-page.component.scss',
})
export class LessonReaderPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly academy = inject(AcademyMockService);
  readonly lesson = computed(() => this.academy.findLesson(this.route.snapshot.paramMap.get('lessonSlug') ?? ''));
}
