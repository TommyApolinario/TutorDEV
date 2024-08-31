import { Component, Output } from '@angular/core';
import { SliderVideosComponent } from '../../../../shared-components/slider-videos/slider-videos.component';

@Component({
  selector: 'app-list-videos-help',
  standalone: true,
  imports: [
    SliderVideosComponent
  ],
  templateUrl: './list-videos-help.component.html',
  styleUrl: './list-videos-help.component.css'
})
export class ListVideosHelpComponent {

}
