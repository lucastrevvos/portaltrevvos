import { Component, input } from '@angular/core';
import { LessonStatus } from '../../core/models/academy.models';

@Component({
  selector: 'app-lesson-status-badge',
  template: `<span [class]="'badge ' + badgeClass()">{{ label() }}</span>`,
})
export class LessonStatusBadgeComponent {
  readonly status = input.required<LessonStatus>();

  label(): string {
    const labels: Record<LessonStatus, string> = {
      locked: 'Bloqueada',
      available: 'Disponivel',
      in_progress: 'Em andamento',
      completed: 'Concluida',
    };
    return labels[this.status()];
  }

  badgeClass(): string {
    const classes: Record<LessonStatus, string> = {
      locked: 'badge-muted',
      available: 'badge-warning',
      in_progress: 'badge-warning',
      completed: 'badge-success',
    };
    return classes[this.status()];
  }
}
