import { CurrencyPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Car } from '../core/models';

@Component({
  selector: 'app-car-card',
  imports: [CurrencyPipe, RouterLink],
  template: `
    <article class="car-card">
      <div class="car-visual" [class]="car().imageClass">
        <span class="availability" [class.unavailable]="!car().available">
          {{ car().available ? 'Disponível' : 'Indisponível' }}
        </span>
        <div class="car-silhouette" aria-hidden="true">🚙</div>
      </div>
      <div class="car-card-content">
        <div class="car-heading">
          <div>
            <span class="eyebrow">{{ car().brand }}</span>
            <h3>{{ car().model }}</h3>
          </div>
          <span class="rating">★ {{ car().rating }}</span>
        </div>
        <p class="muted">📍 {{ car().neighborhood }}, {{ car().city }}</p>
        <div class="car-specs">
          <span>{{ car().transmission }}</span>
          <span>{{ car().year }}</span>
          <span>{{ car().category }}</span>
        </div>
        <div class="car-card-footer">
          <p><strong>{{ car().dailyPrice | currency: 'BRL' : 'symbol' : '1.0-0' }}</strong> / dia</p>
          <a class="text-link" [routerLink]="['/cars', car().id]">Ver detalhes →</a>
        </div>
      </div>
    </article>
  `,
})
export class CarCardComponent {
  readonly car = input.required<Car>();
}
