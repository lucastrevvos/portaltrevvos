import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AcademyMockService } from '../../../core/services/academy-mock.service';
import { CourseModulesPreviewComponent } from '../course-modules-preview/course-modules-preview.component';

@Component({
  selector: 'app-course-public-page',
  imports: [RouterLink, CourseModulesPreviewComponent],
  templateUrl: './course-public-page.component.html',
})
export class CoursePublicPageComponent {
  private readonly academy = inject(AcademyMockService);
  readonly course = this.academy.course;
  readonly lessonCount = computed(() => this.course().modules.reduce((total, module) => total + module.lessons.length, 0));
}
