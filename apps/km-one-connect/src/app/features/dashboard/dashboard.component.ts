import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOOKINGS, DASHBOARD_METRICS, REQUESTS } from '../../core/mock-data';

@Component({
  selector: 'app-dashboard',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
  readonly bookings = BOOKINGS;
  readonly requests = REQUESTS.filter((request) => request.status === 'Pendente');
  readonly metrics = DASHBOARD_METRICS;
}
