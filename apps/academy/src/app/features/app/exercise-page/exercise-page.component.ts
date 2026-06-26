import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { ExerciseStatusBadgeComponent } from '../../../shared/exercise-status-badge/exercise-status-badge.component';
import { ForgeTutorPanelComponent } from '../forge-tutor-panel/forge-tutor-panel.component';

@Component({
  selector: 'app-exercise-page',
  imports: [ExerciseStatusBadgeComponent, ForgeTutorPanelComponent],
  templateUrl: './exercise-page.component.html',
  styleUrl: './exercise-page.component.scss',
})
export class ExercisePageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly academy = inject(AcademyMockService);
  readonly exercise = computed(() => this.academy.findExercise(this.route.snapshot.paramMap.get('exerciseSlug') ?? ''));
  readonly lesson = computed(() => {
    const exercise = this.exercise();
    if (!exercise) return undefined;
    return this.academy.getCourse().modules.flatMap((module) => module.lessons).find((lesson) => lesson.id === exercise.lessonId);
  });
}
