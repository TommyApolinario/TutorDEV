import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-my-evaluations',
  standalone: true,
  imports: [
    SpinnerComponent,
    FontAwesomeModule
  ],
  templateUrl: './my-evaluations.component.html',
  styleUrl: './my-evaluations.component.css'
})
export class MyEvaluationsComponent {

  //Variables
  spinnerStatus: boolean = false;

  //constrcutor
  constructor(
    private router: Router
  ){}

  //ngOnInit
  ngOnInit(){
    this.spinnerStatus = true;
  }

  //Método que redirige a las clases
  goToMyClass(){
    this.router.navigateByUrl('/student/home/classes/my-class')
  }

  //Icons to use
  iconBack = iconos.faArrowLeft;
  iconMyEvaluations = iconos.faListAlt;
  iconEvaluation = iconos.faFileLines;
}
