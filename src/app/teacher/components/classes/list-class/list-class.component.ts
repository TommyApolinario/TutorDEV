import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-class',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './list-class.component.html',
  styleUrl: './list-class.component.css'
})
export class ListClassComponent {

  //Icons to use
  iconClasses = iconos.faChalkboardUser;
}
