import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzFormModule } from 'ng-zorro-antd/form';
import { FormBuilder, FormControl, FormGroup, FormRecord, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { ApiResponseRegisterQuestionIT, BodyRegisterQuestionIT, BodyUpdateQuestionIT } from '../../../interfaces/activities.interface';
import { ActivitiesService } from '../../../services/activities.service';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-order-words',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    SpinnerComponent,
    FontAwesomeModule
  ],
  providers: [
    ActivitiesService,
    SweetAlertsConfirm
  ],
  templateUrl: './order-words.component.html',
  styleUrls: ['./order-words.component.css', '../single-select/single-select.component.css']
})
export class OrderWordsComponent {

  //Variables
  @Input() moduleId: number = 0; //Este moduleID servirá para crear
  @Input() newQuestion!: boolean;
  static activityID: number = 0;
  static moduleID: number = 0; //Este moduleID servirá para editar
  static correctAnswerID: number = 0;
  spinnerStatus: boolean = false;
  questionForm!: FormGroup;
  validateForm: FormRecord<FormControl<string>> = this.fb.record({});
  listOfControl: Array<{ id: number; controlInstance: string }> = [];
  limit: number = 0; //Determina el máximo de palabras a completar que se puede agregar
  tidyOptions: string[] = [];
  messyOptions: string[] = [];
  questionData: ApiResponseRegisterQuestionIT = {} as ApiResponseRegisterQuestionIT;

  //constructor
  constructor(
    private fb: NonNullableFormBuilder,
    private formBuilder: FormBuilder,
    private activitiesService: ActivitiesService,
    private sweetAlerts: SweetAlertsConfirm,
    private toastr: ToastAlertsService,
    private router: Router
  ) { }

  //ngOnInit
  ngOnInit(): void {
    this.spinnerStatus = true;
    this.createQuestionForm();
    this.addField();
    if (!this.newQuestion) {
      this.getQuestionById(OrderWordsComponent.activityID);
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
      difficulty: ['',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(2)
        ]
      ],
    });
  }

  //Método que agrega las filas
  addField(e?: MouseEvent): void {
    e?.preventDefault();
    this.limit = this.listOfControl.length > 0 ? this.listOfControl[this.listOfControl.length - 1].id + 1 : 0;
    const controlInstance = `option ${this.limit}`;
    const control = {
      id: this.limit,
      controlInstance
    };
    this.listOfControl.push(control);
    this.validateForm.addControl(
      controlInstance,
      this.fb.control('', Validators.required)
    );
    this.limit = this.listOfControl.length >= 5 ? 5 : this.listOfControl.length - 1;
  }

  //Método que elimina las filas
  removeField(i: { id: number; controlInstance: string }, e: MouseEvent): void {
    e.preventDefault();
    if (this.listOfControl.length > 1) {
      const index = this.listOfControl.indexOf(i);
      this.listOfControl.splice(index, 1);
      this.validateForm.removeControl(i.controlInstance);
      this.limit = this.listOfControl.length >= 5 ? 5 : this.listOfControl.length - 1;
    }
  }

  //Método que desordena el array
  shuffleArray<T>(array: T[]) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  }

  //Método que llena el body para editar la pregunta
  fillBodyToRegister(): BodyRegisterQuestionIT {
    let body: BodyRegisterQuestionIT = {
      text_root: "Ordena las siguientes palabras para formar una oración que tenga sentido:",
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "order_word",
      options: {
        select_mode: "",
        text_options: this.messyOptions,
        text_to_complete: "",
        hind: ""
      },
      correct_answer: {
        true_or_false: false,
        text_options: this.tidyOptions,
        text_to_complete: []
      }
    }
    return body;
  }

  //Método que manda a registrar la pregunta
  registerQuestion() {
    this.tidyOptions = this.listOfControl.map(control => this.validateForm.get(control.controlInstance)?.value);
    this.messyOptions = this.shuffleArray(this.tidyOptions);

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
    this.questionForm.get('difficulty')?.setValue(this.questionData.difficulty);
    this.listOfControl = [];
    this.questionData.correct_answer.text_options.forEach((element: string, index: number) => {
      const controlInstance = `option ${index + 1}`;
      const control = {
        id: index,
        controlInstance
      };
      this.listOfControl.push(control);
      this.validateForm.addControl(
        controlInstance,
        this.fb.control(element, Validators.required)
      );
    });
  }

  //Método que llena el body para editar la pregunta
  fillBodyToUpdate(): BodyUpdateQuestionIT {
    let body: BodyUpdateQuestionIT = {
      id: OrderWordsComponent.activityID,
      module_id: OrderWordsComponent.moduleID,
      text_root: "Ordena las siguientes palabras para formar una oración que tenga sentido:",
      difficulty: this.questionForm.get('difficulty')?.value,
      type_question: "order_word",
      options: {
        select_mode: "",
        text_options: this.shuffleArray(this.listOfControl.map(control => this.validateForm.get(control.controlInstance)?.value)),
        text_to_complete: "",
        hind: ""
      },
      correct_answer_id: OrderWordsComponent.correctAnswerID,
      correct_answer: {
        true_or_false: false,
        text_options: this.listOfControl.map(control => this.validateForm.get(control.controlInstance)?.value),
        text_to_complete: []
      }
    }
    return body;
  }

  //Método que manda a actualizar la pregunta
  updateActivity() {
    this.spinnerStatus = false;
    this.activitiesService.updateQuestion(this.getHeaders(), this.fillBodyToUpdate(), OrderWordsComponent.moduleID, OrderWordsComponent.activityID,)
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
  iconDelete = iconos.faTrashAlt;
  iconAdd = iconos.faCirclePlus;
  iconBack = iconos.faArrowLeft;
}
