import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { ModulesService } from '../../../services/modules.service';
import { Router } from '@angular/router';
import { BodyCreateModuleIT, DataAllModulesIT } from '../../../interfaces/modules.interface';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import * as AOS from 'aos';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-edit-module',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SpinnerComponent
  ],
  providers: [
    ModulesService
  ],
  templateUrl: './edit-module.component.html',
  styleUrls: ['./edit-module.component.css', '../create-module/create-module.component.css']
})
export class EditModuleComponent {
  //Variables
  static module: BodyCreateModuleIT;
  static moduleID: number = 0;
  spinnerStatus: boolean = false;
  editForm!: FormGroup;
  optionVisibility: string = "";
  optionDifficulty: string = "";

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private toastr: ToastAlertsService,
    private router: Router,
    private moduleService: ModulesService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    AOS.init();
    this.createEditForm();
    this.getInfoModule();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que obtiene la data y la rellena en los campos del formulario
  getInfoModule() {
    this.editForm.get('title')?.setValue(EditModuleComponent.module.title);
    this.editForm.get('shortDescription')?.setValue(EditModuleComponent.module.short_description);
    this.editForm.get('textRoot')?.setValue(EditModuleComponent.module.text_root);
    this.editForm.get('imgBackURL')?.setValue(EditModuleComponent.module.img_back_url);
    if (EditModuleComponent.module.difficulty == "Fácil")
      this.optionDifficulty = "";
    else if (EditModuleComponent.module.difficulty == "Medio")
      this.optionDifficulty = "medium";
    else if (EditModuleComponent.module.difficulty == "Difícil")
      this.optionDifficulty = "";

    if (EditModuleComponent.module.is_public)
      this.optionVisibility = "true";
    else
      this.optionVisibility = "false";
  }

  //Método que crea el formulario para crear un módulo
  createEditForm() {
    this.editForm = this.formBuilder.group({
      title: ['',
        [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ!@#$%^&*(),.: ]*$")],
      ],
      shortDescription: ['', Validators.required],
      textRoot: ['', Validators.required],
      imgBackURL: ['', Validators.required],
      difficulty: ['', Validators.required],
      isPublic: ['', Validators.required],
    });
  }

  //Método que redigire al componente de listar los módulos
  goToListModules() {
    this.router.navigateByUrl("teacher/home/modules/list-modules");
  }

  //Método que consume el servicio para mandar a editar (actualizar) un módulo
  editModule() {
    this.spinnerStatus = false;
    let body: BodyCreateModuleIT = {
      title: this.editForm.value.title,
      short_description: this.editForm.value.shortDescription,
      text_root: this.editForm.value.textRoot,
      img_back_url: this.editForm.value.imgBackURL,
      difficulty: this.editForm.value.difficulty,
      points_to_earn: 100,
      index: 0,
      is_public: this.editForm.value.isPublic == "true" ? true : false
    }
    this.moduleService.editModule(this.getHeaders(), body, EditModuleComponent.moduleID)
      .subscribe({
        next: (data: DataAllModulesIT) => {
          if (data != null) {
            this.spinnerStatus = true;
            this.toastr.showToastSuccess("Módulo actualizado con éxito", "Éxito");
            this.goToListModules();
          }
          else {
            this.spinnerStatus = true;
            this.toastr.showToastError("Error", "No se pudo actualizar el módulo");
            this.goToListModules();
          }
        },
        error: (error: any) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo actualizar el módulo");
        }
      })
  }

  //Icons to use
  iconUploadImg = iconos.faPhotoFilm;
  iconEdit = iconos.faEdit;
  iconBack = iconos.faArrowLeft;
}
