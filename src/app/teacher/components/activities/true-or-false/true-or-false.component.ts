import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { ApiResponseGenerateQuestionWithIAIT, ApiResponseRegisterQuestionIT, BodyRegisterQuestionIT, BodyUpdateQuestionIT } from '../../../interfaces/activities.interface';
import { ActivitiesService } from '../../../services/activities.service';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { GenerateWithIAComponent } from '../modals/generate-with-ia/generate-with-ia.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-true-or-false',
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
  templateUrl: './true-or-false.component.html',
  styleUrls: ['./true-or-false.component.css', '../single-select/single-select.component.css']
})
export class TrueOrFalseComponent {

  //Variables
  @Input() moduleId: number = 0; //Este moduleId servirá para registrar
  @Input() newQuestion!: boolean;
  static activityID: number = 0;
  static moduleID: number = 0; //Este moduleID servirá para editar
  static correctAnswerID: number = 0;
  questionForm!: FormGroup;
  spinnerStatus: boolean = false;
  selectedOption: string | null = null;
  answer: boolean = false;
  questionData: ApiResponseRegisterQuestionIT = {} as ApiResponseRegisterQuestionIT;
  static questionWithIA: ApiResponseGenerateQuestionWithIAIT = {} as ApiResponseGenerateQuestionWithIAIT;
  generatedWithIA: boolean = false;

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private activitiesService: ActivitiesService,
    private sweetAlerts: SweetAlertsConfirm,
    private toastr: ToastAlertsService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.createQuestionForm();
    if (!this.newQuestion) {
      this.getQuestionById(TrueOrFalseComponent.activityID);
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

  //Método que genera la pregunta con IA
  generateWithIA() {
    GenerateWithIAComponent.typeQuestion = "true_or_false";
    let dialogRef = this.dialog.open(GenerateWithIAComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.generatedWithIA = true;
      this.questionForm.get('textRoot')?.setValue(TrueOrFalseComponent.questionWithIA.result.text_root);
      this.questionForm.get('difficulty')?.setValue(TrueOrFalseComponent.questionWithIA.result.difficulty);
      this.answer = TrueOrFalseComponent.questionWithIA.result.correct_answer.true_or_false;
      this.selectedOption = TrueOrFalseComponent.questionWithIA.result.correct_answer.true_or_false ? "option1" : "option2";
    });
  }

  //Método que crea el formulario para crear un módulo
  createQuestionForm() {
    this.questionForm = this.formBuilder.group({
      textRoot: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ!¡¿?.,;:{}[\\]()"\'#$%&=\\s]*$')
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

  //Método que selecciona la opción al hacer click
  selectOption(optionId: string, option: boolean) {
    if (option) {
      this.selectedOption = optionId;
    } else {
      this.selectedOption = null;
    }
    const inputElement = document.getElementById(optionId) as HTMLInputElement;
    inputElement.click();
    this.selectedOption = optionId;
    this.answer = option;
  }

  //Método que llena el body para registrar la pregunta
  fillBodyToRegister(): BodyRegisterQuestionIT {
    let body: BodyRegisterQuestionIT = {
      text_root: this.questionForm.get('textRoot')?.value,
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "true_or_false",
      options: {
        select_mode: "",
        text_options: [],
        text_to_complete: "",
        hind: ""
      },
      correct_answer: {
        true_or_false: this.answer,
        text_options: [],
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
    this.questionForm.get('difficulty')?.setValue(this.questionData.difficulty);
    this.selectedOption = this.questionData.correct_answer.true_or_false ? "option1" : "option2";
    this.answer = this.questionData.correct_answer.true_or_false;
  }

  //Método que llena el body para editar la pregunta
  fillBodyToUpdate(): BodyUpdateQuestionIT {
    let body: BodyUpdateQuestionIT = {
      id: TrueOrFalseComponent.activityID,
      module_id: TrueOrFalseComponent.moduleID,
      text_root: this.questionForm.get('textRoot')?.value,
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "true_or_false",
      options: {
        select_mode: "",
        text_options: [],
        text_to_complete: "",
        hind: ""
      },
      correct_answer_id: TrueOrFalseComponent.correctAnswerID,
      correct_answer: {
        true_or_false: this.answer,
        text_options: [],
        text_to_complete: []
      }
    }
    return body;
  }

  //Método que consume el servicio para actualizar una pregunta
  updateActivity() {
    this.spinnerStatus = false;
    this.activitiesService.updateQuestion(this.getHeaders(), this.fillBodyToUpdate(), TrueOrFalseComponent.moduleID, TrueOrFalseComponent.activityID,)
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
