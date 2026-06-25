import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { CARS } from '../../core/mock-data';

@Component({
  selector: 'app-my-cars',
  imports: [CurrencyPipe],
  templateUrl: './my-cars.component.html',
})
export class MyCarsComponent {
  readonly cars = [CARS[0], CARS[3]];
}
