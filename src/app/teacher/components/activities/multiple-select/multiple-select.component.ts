import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { ActivitiesService } from '../../../services/activities.service';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { ApiResponseRegisterQuestionIT, BodyRegisterQuestionIT, BodyUpdateQuestionIT } from '../../../interfaces/activities.interface';
import { Router } from '@angular/router';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';

@Component({
  selector: 'app-multiple-select',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    SpinnerComponent
  ],
  providers: [
    ActivitiesService,
    SweetAlertsConfirm
  ],
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.css', '../single-select/single-select.component.css']
})
export class MultipleSelectComponent {

  //Variables
  @Input() moduleId: number = 0;
  @Input() newQuestion!: boolean;
  static activityID: number = 0;
  static moduleID: number = 0;
  static correctAnswerID: number = 0;
  spinnerStatus: boolean = false;
  questionForm!: FormGroup;
  questionData: ApiResponseRegisterQuestionIT = {} as ApiResponseRegisterQuestionIT;

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private activitiesService: ActivitiesService,
    private toastr: ToastAlertsService,
    private router: Router,
    private sweetAlerts: SweetAlertsConfirm
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.createQuestionForm();

    if (!this.newQuestion) {
      console.log(MultipleSelectComponent.activityID);
      this.getQuestionById(MultipleSelectComponent.activityID);
    }
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que redirige a la lista de actividades
  goToListActivities() {
    this.sweetAlerts.alertConfirmCancelQuestion("Abandonar", "¿Deseas abandonar esta página? Si lo haces y no has actualizado la información, es posible que los cambios no se guarden.").then(respuesta => {
      if (respuesta.value) {
        this.spinnerStatus = false;
        this.router.navigateByUrl("/teacher/home/activities/list-activities");
        this.spinnerStatus = true;
      }
    });
  }

  //Método que crea el formulario para crear un módulo
  createQuestionForm() {
    this.questionForm = this.formBuilder.group({
      textRoot: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.:;\\s]*$')
        ]
      ],
      optionOne: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      optionTwo: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      optionThree: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      optionFour: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      optionFive: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      optionSix: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      difficulty: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(2)
        ]
      ],
    });
  }

  //Método que llena el body para registrar la pregunta
  fillBodyToRegister(): BodyRegisterQuestionIT {
    let body: BodyRegisterQuestionIT = {
      text_root: this.questionForm.get('textRoot')?.value,
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "multi_choice_text",
      options: {
        select_mode: "multiple",
        text_options: [
          this.questionForm.get('optionOne')?.value,
          this.questionForm.get('optionTwo')?.value,
          this.questionForm.get('optionThree')?.value,
          this.questionForm.get('optionFour')?.value,
          this.questionForm.get('optionFive')?.value,
          this.questionForm.get('optionSix')?.value
        ],
        text_to_complete: "",
        hind: ""
      },
      correct_answer: {
        true_or_false: false,
        text_options: [
          this.questionForm.get('optionOne')?.value,
          this.questionForm.get('optionTwo')?.value,
          this.questionForm.get('optionThree')?.value,
        ],
        text_to_complete: []
      }
    }
    return body;
  }

  //Método que consume el servicio para registrar una pregunta manualmente o con IA
  registerQuestion() {
    this.spinnerStatus = false;
    this.activitiesService.registerQuestion(this.getHeaders(), this.fillBodyToRegister(), this.moduleId)
      .subscribe({
        next: (data: ApiResponseRegisterQuestionIT) => {
          if (data.id != 0) {
            this.spinnerStatus = true;
            this.questionForm.reset();
            this.toastr.showToastSuccess("Pregunta registrada correctamente", "Éxito");
            this.router.navigateByUrl("/teacher/home/activities/list-activities");
          }
        },
        error: (error: any) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo registrar su pregunta");
        }
      })
  }

  //Método que obtiene la data de una pregunta por su ID
  getQuestionById(questionID: number) {
    this.spinnerStatus = false;
    this.activitiesService.getQuestionById(this.getHeaders(), questionID)
      .subscribe({
        next: (data: ApiResponseRegisterQuestionIT) => {
          this.questionData = data;
          this.fillQuestionForm();
          this.spinnerStatus = true;
        },
        error: (error: any) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "Ocurrió un error al obtener la pregunta");
        }
      })
  }

  //Método que rellena los campos con la data de la pregunta
  fillQuestionForm() {
    this.questionForm.get('textRoot')?.setValue(this.questionData.text_root);
    this.questionForm.get('optionOne')?.setValue(this.questionData.options.text_options[0]);
    this.questionForm.get('optionTwo')?.setValue(this.questionData.options.text_options[1]);
    this.questionForm.get('optionThree')?.setValue(this.questionData.options.text_options[2]);
    this.questionForm.get('optionFour')?.setValue(this.questionData.options.text_options[3]);
    this.questionForm.get('optionFive')?.setValue(this.questionData.options.text_options[4]);
    this.questionForm.get('optionSix')?.setValue(this.questionData.options.text_options[5]);
    this.questionForm.get('difficulty')?.setValue(this.questionData.difficulty);
  }

  //Método que llena el body para registrar la pregunta
  fillBodyToUpdat(): BodyUpdateQuestionIT {
    let body: BodyUpdateQuestionIT = {
      id: MultipleSelectComponent.activityID,
      module_id: MultipleSelectComponent.moduleID,
      text_root: this.questionForm.get('textRoot')?.value,
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "multi_choice_text",
      options: {
        select_mode: "multiple",
        text_options: [
          this.questionForm.get('optionOne')?.value,
          this.questionForm.get('optionTwo')?.value,
          this.questionForm.get('optionThree')?.value,
          this.questionForm.get('optionFour')?.value,
          this.questionForm.get('optionFive')?.value,
          this.questionForm.get('optionSix')?.value
        ],
        text_to_complete: "",
        hind: ""
      },
      correct_answer_id: MultipleSelectComponent.correctAnswerID,
      correct_answer: {
        true_or_false: false,
        text_options: [
          this.questionForm.get('optionOne')?.value,
          this.questionForm.get('optionTwo')?.value,
          this.questionForm.get('optionThree')?.value,
        ],
        text_to_complete: []
      }
    }
    return body;
  }

  //Método que actualiza una pregunta
  updateActivity() {
    this.spinnerStatus = false;
    this.activitiesService.updateQuestion(this.getHeaders(), this.fillBodyToUpdat(), MultipleSelectComponent.moduleID, MultipleSelectComponent.activityID,)
      .subscribe({
        next: () => {
          this.spinnerStatus = true;
          this.toastr.showToastSuccess("Pregunta actualizada correctamente", "Éxito");
          this.router.navigateByUrl("/teacher/home/activities/list-activities");
        },
        error: (error: any) => {
          this.spinnerStatus = true;
          if (error.status === 200 && error.statusText === "OK") {
            this.toastr.showToastSuccess("Pregunta actualizada correctamente", "Éxito");
            this.router.navigateByUrl("/teacher/home/activities/list-activities");
          } else {
            this.toastr.showToastError("Error", "Ocurrió un error al actualizar la pregunta");
          }
        }
      })
  }

  //Icons to use
  iconCube = iconos.faCube;
  iconIA = iconos.faWandMagicSparkles;
  iconBack = iconos.faArrowLeft;
}
