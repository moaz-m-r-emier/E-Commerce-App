import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-main-slider',
  styleUrl: './main-slider.component.css',
  templateUrl: './main-slider.component.html',
  schemas : [CUSTOM_ELEMENTS_SCHEMA]
})
export class MainSliderComponent {}
