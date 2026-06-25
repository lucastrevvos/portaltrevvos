import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { REQUESTS } from '../../core/mock-data';

@Component({
  selector: 'app-requests',
  imports: [CurrencyPipe],
  templateUrl: './requests.component.html',
})
export class RequestsComponent {
  readonly requests = REQUESTS;
}
