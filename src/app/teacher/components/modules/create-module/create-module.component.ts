import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { Router } from '@angular/router';
import { ModulesService } from '../../../services/modules.service';
import { BodyCreateModuleIT, DataAllModulesIT } from '../../../interfaces/modules.interface';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import * as AOS from 'aos';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-create-module',
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
  templateUrl: './create-module.component.html',
  styleUrl: './create-module.component.css'
})
export class CreateModuleComponent {

  //Variables
  spinnerStatus: boolean = false;
  createNewModule!: FormGroup;
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
    this.createNewModuleForm();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que crea el formulario para crear un módulo
  createNewModuleForm() {
    this.createNewModule = this.formBuilder.group({
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

  //Método que consume el servicio para mandar a crear un módulo
  createModule() {
    this.spinnerStatus = false;
    let body: BodyCreateModuleIT = {
      title: this.createNewModule.get('title')?.value,
      short_description: this.createNewModule.get('shortDescription')?.value,
      text_root: this.createNewModule.get('textRoot')?.value.replace(/\n/g, '\r\n'),
      img_back_url: this.createNewModule.get('imgBackURL')?.value,
      difficulty: this.createNewModule.get('difficulty')?.value,
      points_to_earn: 100,
      index: 0,
      is_public: this.createNewModule.value.isPublic == "true" ? true : false
    }
    this.moduleService.createNewModule(this.getHeaders(), body)
    .subscribe({
      next: (data: DataAllModulesIT) => {
        if(data != null){
          this.spinnerStatus = true;
          this.toastr.showToastSuccess("Módulo creado con éxito", "Éxito");
          this.goToListModules();
        }
        else{
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo registrar el módulo");
          this.goToListModules();
        }
      },
      error: (error: any) =>{
        this.spinnerStatus = true;
        this.toastr.showToastError("Error", "No se pudo registrar el módulo");
      }
    })
  }

  //Icons to use
  iconUploadImg = iconos.faPhotoFilm;
  iconModule = iconos.faCube;
  iconBack = iconos.faArrowLeft;
}
