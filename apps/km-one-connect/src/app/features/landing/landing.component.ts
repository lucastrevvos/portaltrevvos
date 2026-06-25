import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CARS } from '../../core/mock-data';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, CarCardComponent],
  templateUrl: './landing.component.html',
})
export class LandingComponent {
  readonly featuredCars = CARS.slice(0, 3);
}
