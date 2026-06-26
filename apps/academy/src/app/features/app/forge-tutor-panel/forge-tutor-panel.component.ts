import { Component, inject, input } from '@angular/core';
import { AcademyExercise } from '../../../core/models/academy.models';
import { ForgeMockService } from '../../../core/services/forge-mock.service';

@Component({
  selector: 'app-forge-tutor-panel',
  templateUrl: './forge-tutor-panel.component.html',
  styleUrl: './forge-tutor-panel.component.scss',
})
export class ForgeTutorPanelComponent {
  private readonly forge = inject(ForgeMockService);
  readonly exercise = input.required<AcademyExercise>();
  readonly lastValidation = this.forge.lastValidation;

  validate(): void {
    this.forge.simulateValidation(this.exercise().slug);
  }

  reject(): void {
    this.forge.simulateRejected(this.exercise().slug);
  }

  approve(): void {
    this.forge.simulateApproved(this.exercise().slug);
  }
}
