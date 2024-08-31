import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../../shared-components/spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivitiesService } from '../../../../services/activities.service';
import { ApiResponseGenerateQuestionWithIAIT, BodyGenerateQuestionWithIAIT } from '../../../../interfaces/activities.interface';
import { SingleSelectComponent } from '../../single-select/single-select.component';
import { ToastAlertsService } from '../../../../../shared-components/services/toast-alerts.service';
import { HttpClientModule } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { CompleteWordComponent } from '../../complete-word/complete-word.component';
import { TrueOrFalseComponent } from '../../true-or-false/true-or-false.component';

@Component({
  selector: 'app-generate-with-ia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SpinnerComponent,
    FontAwesomeModule,
    HttpClientModule
  ],
  providers: [
    ActivitiesService
  ],
  templateUrl: './generate-with-ia.component.html',
  styleUrl: './generate-with-ia.component.css'
})
export class GenerateWithIAComponent {

  //Variables
  spinnerStatus: boolean = false;
  questionIAForm!: FormGroup;
  static typeQuestion: string = "";
  optionModel: string = "";

  // Constructor
  constructor(
    public modal: NgbModal,
    private formBuilder: FormBuilder,
    private activitiesService: ActivitiesService,
    private toastr: ToastAlertsService,
    public dialogRef: MatDialogRef<GenerateWithIAComponent>,
  ) { }

  //NgOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.createForm();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que crea el formulario
  createForm() {
    this.questionIAForm = this.formBuilder.group({
      context: ['',
        [
          Validators.required,
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ,.""¿?!¡;:\\s]*$')
        ]
      ],
      model: ['', Validators.required],
    });
  }

  //Método que actualiza el valor de la variable optionModel para determinar el tipo de modelo para generar
  updateOptionModel(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.optionModel = target.value;
    }
  }

  //Método que rellena el formulario con el contexto indicado por el profesor
  fillBodyToGenerateQuestion(): BodyGenerateQuestionWithIAIT {
    let body: BodyGenerateQuestionWithIAIT = {
      type_question: GenerateWithIAComponent.typeQuestion,
      context: this.questionIAForm.value.context,
      model_version: Number(this.optionModel)
    }
    return body;
  }

  //Método que consume el servicio que genera la pregunta
  generateQuestion() {
    this.spinnerStatus = false;
    this.activitiesService.generateQuestionWithIA(this.getHeaders(), this.fillBodyToGenerateQuestion())
      .subscribe({
        next: (data: ApiResponseGenerateQuestionWithIAIT) => {
          this.spinnerStatus = true;
          switch (GenerateWithIAComponent.typeQuestion) {
            case ("complete_word"):
              CompleteWordComponent.questionWithIA = data;
              break;
            case ("multi_choice_text"):
              SingleSelectComponent.questionWithIA = data;
              break;
            case ("true_or_false"):
              TrueOrFalseComponent.questionWithIA = data;
              break;
          }
          this.closeModal();
          this.toastr.showToastSuccess("Pregunta generada con éxito", "Éxito");
        },
        error: () => {
          this.spinnerStatus = true;
          this.closeModal();
          this.toastr.showToastError("Error", "Ocurrií un error al generar la pregunta");
        }
      })
  }

  //Método que cierra el modal
  closeModal() {
    this.dialogRef.close();
  }

  //Icons to use
  iconIA = iconos.faMagicWandSparkles;
}
