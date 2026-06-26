import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { AiModeComparisonComponent } from '../ai-mode-comparison/ai-mode-comparison.component';
import { CourseModulesPreviewComponent } from '../course-modules-preview/course-modules-preview.component';
import { ForgeMethodologySectionComponent } from '../forge-methodology-section/forge-methodology-section.component';

@Component({
  selector: 'app-academy-landing-page',
  imports: [RouterLink, AiModeComparisonComponent, CourseModulesPreviewComponent, ForgeMethodologySectionComponent],
  templateUrl: './academy-landing-page.component.html',
  styleUrl: './academy-landing-page.component.scss',
})
export class AcademyLandingPageComponent {
  private readonly academy = inject(AcademyMockService);
  readonly course = this.academy.course;
  readonly flow = ['Estude a aula', 'Pratique localmente', 'Chame o Forge Tutor', 'Receba dicas', 'Forge valida', 'Proxima aula liberada'];
}
