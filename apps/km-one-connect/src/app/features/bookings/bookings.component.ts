import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BOOKINGS } from '../../core/mock-data';

@Component({
  selector: 'app-bookings',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './bookings.component.html',
})
export class BookingsComponent {
  readonly bookings = BOOKINGS;
}
