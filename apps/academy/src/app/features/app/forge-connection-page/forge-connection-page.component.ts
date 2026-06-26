import { Component, inject } from '@angular/core';
import { ForgeMockService } from '../../../core/services/forge-mock.service';
import { StudentProgressMockService } from '../../../core/services/student-progress-mock.service';
import { AiMode } from '../../../core/models/academy.models';

@Component({
  selector: 'app-forge-connection-page',
  templateUrl: './forge-connection-page.component.html',
})
export class ForgeConnectionPageComponent {
  private readonly progress = inject(StudentProgressMockService);
  private readonly forge = inject(ForgeMockService);
  readonly dashboard = this.progress.dashboard;
  readonly logs = this.forge.logs;

  setMode(mode: AiMode): void {
    this.progress.setAiMode(mode);
  }
}
