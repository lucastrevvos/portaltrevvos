import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AiModeComparisonComponent } from '../ai-mode-comparison/ai-mode-comparison.component';

@Component({
  selector: 'app-ai-pricing-page',
  imports: [RouterLink, AiModeComparisonComponent],
  templateUrl: './ai-pricing-page.component.html',
})
export class AiPricingPageComponent {}
