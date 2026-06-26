import { Injectable, signal } from '@angular/core';
import { forgeLogsMock } from '../data/academy.mock-data';
import { ExerciseAttempt, ForgeLog, ForgeValidationResult } from '../models/academy.models';
import { AcademyMockService } from './academy-mock.service';

@Injectable({ providedIn: 'root' })
export class ForgeMockService {
  private readonly logsState = signal<ForgeLog[]>([...forgeLogsMock]);
  readonly logs = this.logsState.asReadonly();
  private readonly lastValidationState = signal<ForgeValidationResult | null>(null);
  readonly lastValidation = this.lastValidationState.asReadonly();

  constructor(private readonly academy: AcademyMockService) {}

  simulateValidation(exerciseSlug: string): ForgeValidationResult {
    return this.simulateRejected(exerciseSlug);
  }

  simulateRejected(exerciseSlug: string): ForgeValidationResult {
    return this.applyResult(exerciseSlug, 'rejected');
  }

  simulateApproved(exerciseSlug: string): ForgeValidationResult {
    return this.applyResult(exerciseSlug, 'approved');
  }

  private applyResult(exerciseSlug: string, status: 'approved' | 'rejected'): ForgeValidationResult {
    const course = this.academy.getCourse();
    const lesson = course.modules.flatMap((module) => module.lessons).find((item) =>
      item.exercises.some((exercise) => exercise.slug === exerciseSlug),
    );
    const exercise = lesson?.exercises.find((item) => item.slug === exerciseSlug);

    if (!lesson || !exercise) {
      throw new Error(`Exercicio nao encontrado: ${exerciseSlug}`);
    }

    const approved = status === 'approved';
    const result: ForgeValidationResult = {
      courseId: course.id,
      lessonId: lesson.id,
      exerciseId: exercise.id,
      status,
      score: approved ? 94 : 58,
      feedback: approved
        ? 'Forge validou este exercicio e enviou o evento done para a Academy API.'
        : 'Voce esta no caminho certo, mas a regra principal ainda parece estar dentro do controller. Revise a separacao entre entrada HTTP e regra de aplicacao. Tente mover a decisao de negocio para uma camada de aplicacao antes de pedir nova validacao.',
      checks: [
        {
          id: 'check-responsibility',
          status: approved ? 'passed' : 'failed',
          message: approved
            ? 'A responsabilidade principal ficou fora da entrada HTTP.'
            : 'Ainda ha decisao de negocio misturada com a entrada HTTP.',
        },
        {
          id: 'check-evidence',
          status: approved ? 'passed' : 'failed',
          message: approved
            ? 'As evidencias locais sustentam a conclusao.'
            : 'Inclua evidencias mais claras do comportamento implementado.',
        },
      ],
      forgeSessionId: `forge-${Date.now()}`,
    };

    this.academy.updateCourse((draft) => {
      const draftLesson = draft.modules.flatMap((module) => module.lessons).find((item) => item.id === lesson.id);
      const draftExercise = draftLesson?.exercises.find((item) => item.id === exercise.id);
      if (!draftLesson || !draftExercise) return;

      const attempt: ExerciseAttempt = {
        id: `attempt-${Date.now()}`,
        exerciseId: exercise.id,
        status,
        score: result.score,
        feedback: result.feedback,
        createdAt: new Date().toISOString(),
        forgeSessionId: result.forgeSessionId,
      };

      draftExercise.status = status;
      draftExercise.attempts = [attempt, ...draftExercise.attempts];

      const requiredApproved = draftLesson.exercises
        .filter((item) => item.required)
        .every((item) => item.status === 'approved');

      if (requiredApproved) {
        draftLesson.status = 'completed';
        const orderedLessons = draft.modules.flatMap((module) => module.lessons).sort((a, b) => a.order - b.order);
        const currentIndex = orderedLessons.findIndex((item) => item.id === draftLesson.id);
        const nextLesson = orderedLessons[currentIndex + 1];
        if (nextLesson && nextLesson.status === 'locked') {
          nextLesson.status = 'available';
        }
      } else if (draftLesson.status === 'available') {
        draftLesson.status = 'in_progress';
      }
    });

    this.lastValidationState.set(result);
    this.logsState.update((logs) => [
      {
        id: `log-${Date.now()}`,
        message: approved
          ? `Evento done simulado para ${exercise.title}. Progresso recalculado.`
          : `Validacao reprovada para ${exercise.title}. Dicas progressivas enviadas.`,
        createdAt: new Date().toISOString(),
        mode: 'local',
        status: approved ? 'success' : 'warning',
      },
      ...logs,
    ]);

    return result;
  }
}
