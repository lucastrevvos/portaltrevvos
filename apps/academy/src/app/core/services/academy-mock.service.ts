import { Injectable, signal } from '@angular/core';
import { academyCourseMock } from '../data/academy.mock-data';
import { AcademyCourse, AcademyExercise, AcademyLesson } from '../models/academy.models';

@Injectable({ providedIn: 'root' })
export class AcademyMockService {
  private readonly courseState = signal<AcademyCourse>(structuredClone(academyCourseMock));
  readonly course = this.courseState.asReadonly();

  getCourse(): AcademyCourse {
    return this.courseState();
  }

  findLesson(slug: string): AcademyLesson | undefined {
    return this.getCourse().modules.flatMap((module) => module.lessons).find((lesson) => lesson.slug === slug);
  }

  findExercise(slug: string): AcademyExercise | undefined {
    return this.getCourse()
      .modules.flatMap((module) => module.lessons)
      .flatMap((lesson) => lesson.exercises)
      .find((exercise) => exercise.slug === slug);
  }

  updateCourse(mutator: (course: AcademyCourse) => void): void {
    const next = structuredClone(this.courseState());
    mutator(next);
    this.courseState.set(next);
  }
}
