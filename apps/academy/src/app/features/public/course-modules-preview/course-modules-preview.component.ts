import { Component, input } from '@angular/core';
import { AcademyCourse } from '../../../core/models/academy.models';

@Component({
  selector: 'app-course-modules-preview',
  templateUrl: './course-modules-preview.component.html',
})
export class CourseModulesPreviewComponent {
  readonly course = input.required<AcademyCourse>();
}
