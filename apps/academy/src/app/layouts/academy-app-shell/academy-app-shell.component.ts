import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { StudentProgressMockService } from '../../core/services/student-progress-mock.service';

@Component({
  selector: 'app-academy-app-shell',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './academy-app-shell.component.html',
  styleUrl: './academy-app-shell.component.scss',
})
export class AcademyAppShellComponent {
  private readonly progress = inject(StudentProgressMockService);
  readonly dashboard = this.progress.dashboard;
}
