import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as AOS from 'aos';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.css', '../login/login.component.css']
})
export class TermsConditionsComponent {
  
  //Variables
  static type: number;
  typeLocal: number = 0;

  //constructor
  constructor(
    private location: Location
  ){}

  //NgOnInit()
  ngOnInit() {
    AOS.init();
    this.typeLocal = TermsConditionsComponent.type;
  }

  //Método que redirecciona al login
  goToBack(){
    this.location.back();
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
}
