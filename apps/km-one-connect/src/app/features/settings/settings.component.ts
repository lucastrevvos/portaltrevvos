import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { USER_PROFILE } from '../../core/mock-data';

@Component({
  selector: 'app-settings',
  imports: [FormsModule],
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  profile = { ...USER_PROFILE };
}
