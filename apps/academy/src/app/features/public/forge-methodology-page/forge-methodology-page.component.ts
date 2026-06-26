import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ForgeMethodologySectionComponent } from '../forge-methodology-section/forge-methodology-section.component';

@Component({
  selector: 'app-forge-methodology-page',
  imports: [RouterLink, ForgeMethodologySectionComponent],
  templateUrl: './forge-methodology-page.component.html',
})
export class ForgeMethodologyPageComponent {}
