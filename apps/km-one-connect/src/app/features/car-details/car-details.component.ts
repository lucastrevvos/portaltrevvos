import { CurrencyPipe } from '@angular/common';
import { Component, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CARS } from '../../core/mock-data';

@Component({
  selector: 'app-car-details',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './car-details.component.html',
})
export class CarDetailsComponent {
  readonly car = computed(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return CARS.find((item) => item.id === id) ?? CARS[0];
  });

  constructor(private readonly route: ActivatedRoute) {}
}
