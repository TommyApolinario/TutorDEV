import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { ApiResponseGenerateQuestionWithIAIT, ApiResponseRegisterQuestionIT, BodyRegisterQuestionIT, BodyUpdateQuestionIT } from '../../../interfaces/activities.interface';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { ActivitiesService } from '../../../services/activities.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { GenerateWithIAComponent } from '../modals/generate-with-ia/generate-with-ia.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-complete-word',
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
  templateUrl: './complete-word.component.html',
  styleUrls: ['./complete-word.component.css', '../single-select/single-select.component.css']
})
export class CompleteWordComponent {

  //Variables
  @Input() moduleId: number = 0; //Este moduleId servirá para registrar
  @Input() newQuestion!: boolean;
  static activityID: number = 0;
  static moduleID: number = 0; //Este moduleID servirá para editar
  static correctAnswerID: number;
  questionForm!: FormGroup;
  spinnerStatus: boolean = false;
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
    if (!this.newQuestion)
      this.getQuestionById(CompleteWordComponent.activityID);
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
    GenerateWithIAComponent.typeQuestion = "complete_word";
    let dialogRef = this.dialog.open(GenerateWithIAComponent, {
      width: '600px',
    });
    dialogRef.afterClosed().subscribe(result => {
      this.generatedWithIA = true;
      this.questionForm.get('textRoot')?.setValue(CompleteWordComponent.questionWithIA.result.text_root);
      this.questionForm.get('hind')?.setValue(CompleteWordComponent.questionWithIA.result.options.hind);
      this.questionForm.get('wordToComplete')?.setValue(CompleteWordComponent.questionWithIA.result.correct_answer.text_options[0]);
      this.questionForm.get('difficulty')?.setValue(CompleteWordComponent.questionWithIA.result.difficulty);
    });
  }

  //Método que crea el formulario para crear un módulo
  createQuestionForm() {
    this.questionForm = this.formBuilder.group({
      textRoot: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.:;()\\s]*$')
        ]
      ],
      wordToComplete: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]*$')
        ]
      ],
      hind: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.:;()\\s]*$')
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
      type_question: "complete_word",
      options: {
        select_mode: "",
        text_options: [],
        text_to_complete: this.questionForm.get('wordToComplete')?.value.toLowerCase(),
        hind: this.questionForm.get('hind')?.value
      },
      correct_answer: {
        true_or_false: false,
        text_options: [],
        text_to_complete: [this.questionForm.get('wordToComplete')?.value.toLowerCase()]
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
    this.questionForm.get('wordToComplete')?.setValue(this.questionData.options.text_to_complete);
    this.questionForm.get('hind')?.setValue(this.questionData.options.hind);
    this.questionForm.get('difficulty')?.setValue(this.questionData.difficulty);
  }

  //Método que llena el body para editar la pregunta
  fillBodyToUpdate(): BodyUpdateQuestionIT {
    let body: BodyUpdateQuestionIT = {
      id: CompleteWordComponent.activityID,
      module_id: CompleteWordComponent.moduleID,
      text_root: this.questionForm.get('textRoot')?.value,
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "complete_word",
      options: {
        select_mode: "",
        text_options: [],
        text_to_complete: this.questionForm.get('wordToComplete')?.value.toLowerCase(),
        hind: this.questionForm.get('hind')?.value,
      },
      correct_answer_id: CompleteWordComponent.correctAnswerID,
      correct_answer: {
        true_or_false: false,
        text_options: [],
        text_to_complete: [this.questionForm.get('wordToComplete')?.value.toLowerCase()]
      }
    }
    return body;
  }

  //Método que manda a actualiza la pregunta
  updateActivity() {
    this.spinnerStatus = false;
    this.activitiesService.updateQuestion(this.getHeaders(), this.fillBodyToUpdate(), CompleteWordComponent.moduleID, CompleteWordComponent.activityID,)
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
