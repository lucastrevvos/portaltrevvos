import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CARS } from '../../core/mock-data';
import { CarCardComponent } from '../../shared/car-card.component';

@Component({
  selector: 'app-cars',
  imports: [FormsModule, CarCardComponent],
  templateUrl: './cars.component.html',
})
export class CarsComponent {
  readonly search = signal('');
  readonly transmission = signal('Todos');
  readonly cars = computed(() => {
    const query = this.search().trim().toLowerCase();
    return CARS.filter((car) => {
      const matchesQuery =
        !query ||
        `${car.brand} ${car.model} ${car.city} ${car.neighborhood}`.toLowerCase().includes(query);
      const matchesTransmission =
        this.transmission() === 'Todos' || car.transmission === this.transmission();
      return matchesQuery && matchesTransmission;
    });
  });
}
