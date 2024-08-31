import { OrderWordsComponent } from './../order-words/order-words.component';
import { Component } from '@angular/core';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SelectWithSentenceComponent } from '../select-with-sentence/select-with-sentence.component';
import { SelectSeveralCorrectComponent } from '../select-several-correct/select-several-correct.component';
import { CompleteParagraphComponent } from '../complete-paragraph/complete-paragraph.component';
import { TrueOrFalseComponent } from '../true-or-false/true-or-false.component';
import { ModulesService } from '../../../services/modules.service';
import { ActivitiesDetailI, ApiResponseGetActivitiesByLessonI, ApiResponseValidateAnswerI, BodyValidateAnswerI } from '../../../interfaces/lessons';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { CommonModule } from '@angular/common';
import { FinishActivityComponent } from '../finish-activity/finish-activity.component';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-activities-container',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    SelectWithSentenceComponent,
    SelectSeveralCorrectComponent,
    CompleteParagraphComponent,
    OrderWordsComponent,
    TrueOrFalseComponent,
    SpinnerComponent,
    CompleteParagraphComponent,
    FinishActivityComponent
  ],
  providers: [
    SweetAlertsConfirm,
    ModulesService,
  ],
  templateUrl: './activities-container.component.html',
  styleUrl: './activities-container.component.css'
})
export class ActivitiesContainerComponent {
  //Variables
  isSelectedOption: string = '';
  static moduleID: number = 0;
  spinnerStatus: boolean = false;
  arrayActivities: ActivitiesDetailI[] = [];
  lessonID: number = 0; //ID de la lección para luego enviar a finalizar prueba
  nextActivity: number = 0; //Para avanzar a la siguiente actividad
  //Variables para almacenar las respuestas que devuelven los componentes
  answersSelectOrOrderActivity: string[] = [];
  answerTextToCompleteActivity: string[] = [];
  answerTrueOrFalseActivity: boolean = false;

  answerUserId: number = 0;
  statusAnswer: number = 0; //1 para respuesta correcta, 2 para respuesta incorrecta, 0 para respuesta sin validar

  nameButton: string = "Comprobar";
  feedback: string = ""; //Mensaje para el feedback
  totalProgressBar: number = 0; //Barra de progreso
  loadingButton: boolean = false;

  //constructor
  constructor(
    private router: Router,
    private sweetAlerts: SweetAlertsConfirm,
    private modulesService: ModulesService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.generateNewLesson();
    this.modulesService.getSelectedOption().subscribe(status => {
      this.isSelectedOption = status;
    });
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que genera una nueva lección
  generateNewLesson() {
    this.spinnerStatus = false;
    this.modulesService.newLesson(this.getHeaders(), ActivitiesContainerComponent.moduleID).subscribe({
      next: (data: any) => {
        if (data != 0) {
          this.spinnerStatus = true;
          this.getActivitiesByLessonID(data.testId)
        }
        else {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se ha podido generar una nueva práctica");
        }
      }
    })
  }

  //Método que obtiene el listado de las actividades según el ID del módulo
  getActivitiesByLessonID(lessonID: number) {
    this.lessonID = lessonID;
    this.spinnerStatus = false;
    this.modulesService.getActivitiesByLesson(this.getHeaders(), lessonID)
      .subscribe({
        next: (data: ApiResponseGetActivitiesByLessonI) => {
          this.spinnerStatus = true;
          this.totalProgressBar = data.test_module_question_answers.length;
          this.arrayActivities = data.test_module_question_answers;
        }
      })
  }

  //Método que obtiene las opciones seleccionadas en la actividad de select-several-correct
  getMultiOptionsSelected(optionsSelected: string[]) {
    this.answersSelectOrOrderActivity = optionsSelected;
  }

  //Método que obtiene la opción seleccionada en la actividad de select-with-sentence
  getSingleOptionSelected(optionSelected: string[]) {
    this.answersSelectOrOrderActivity = optionSelected;
  }

  //Método que obtiene el array con las palabras ordenadas en la actividad de ordenar palabras
  getWordsInOrder(orderedWords: string[]) {
    this.answersSelectOrOrderActivity = orderedWords;
  }

  //Método que obtiene el array con las palabras ordenadas en la actividad de ordenar palabras
  getTrueOrFalse(optionBoolean: boolean) {
    this.answerTrueOrFalseActivity = optionBoolean;
  }

  //Método que obtiene el texto ingresado en la actividad de completar párrafo
  getTextToComplete(textToComplete: string[]) {
    this.answerTextToCompleteActivity = textToComplete;
  }

  //Método que ejecuta un alert para confirmar si desea abandonar la práctica
  leavePractice() {
    this.sweetAlerts.alertConfirmCancelQuestion("Abandonar práctica", "¿Estás seguro de querer abandonar la práctica que tienes en curso?").then(respuesta => {
      if (respuesta.value == true) {
        this.router.navigateByUrl('student/home/learn/modules');
      }
    });
  }

  //Método que obtiene el answerUserId
  getAnswerUserId(answerUserId: number) {
    this.answerUserId = answerUserId;
  }

  //Método que valida la respuesta y avanza a la siguiente pregunta
  checkAnswer() {
    this.loadingButton = true;
    if (this.nameButton == "Comprobar") {
      let body: BodyValidateAnswerI = {
        true_or_false: this.answerTrueOrFalseActivity,
        text_options: this.answersSelectOrOrderActivity,
        text_to_complete: this.answerTextToCompleteActivity,
      }
      this.modulesService.validateResponseUser(this.getHeaders(), this.answerUserId, body)
        .subscribe({
          next: (data: ApiResponseValidateAnswerI) => {
            console.log("Imprimiento data")
            console.log(data);
            this.statusAnswer = data.is_correct ? 1 : 2;
            this.feedback = data.feedback;
            this.nameButton = "Siguiente";
          },
          complete: () => {
            this.loadingButton = false; // Ocultar el spinner de carga cuando se complete la llamada
          }
        });
    } else {
      this.nameButton = "Comprobar";
      this.statusAnswer = 0;
      this.nextActivity++;
      this.isSelectedOption = '';
      this.loadingButton = false; // Ocultar el spinner de carga cuando se complete la acción
    }
  }

  //Icons to use
  iconExit = iconos.faXmark;
  iconNext = iconos.faArrowRight;
  iconLeave = iconos.faXmark;
  iconLifes = iconos.faHeart;
  iconCheck = iconos.faCircleCheck;
  iconError = iconos.faCircleXmark;
}
