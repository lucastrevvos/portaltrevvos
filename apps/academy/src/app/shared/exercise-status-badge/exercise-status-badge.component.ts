import { Component, input } from '@angular/core';
import { ExerciseStatus } from '../../core/models/academy.models';

@Component({
  selector: 'app-exercise-status-badge',
  template: `<span [class]="'badge ' + badgeClass()">{{ label() }}</span>`,
})
export class ExerciseStatusBadgeComponent {
  readonly status = input.required<ExerciseStatus>();

  label(): string {
    const labels: Record<ExerciseStatus, string> = {
      pending: 'Pendente',
      approved: 'Aprovado',
      rejected: 'Reprovado',
    };
    return labels[this.status()];
  }

  badgeClass(): string {
    const classes: Record<ExerciseStatus, string> = {
      pending: 'badge-warning',
      approved: 'badge-success',
      rejected: 'badge-danger',
    };
    return classes[this.status()];
  }
}
