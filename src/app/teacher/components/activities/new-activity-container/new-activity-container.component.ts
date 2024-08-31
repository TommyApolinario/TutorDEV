import { Component } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModulesService } from '../../../services/modules.service';
import { ApiResponseAllModulesIT, DataAllModulesIT } from '../../../interfaces/modules.interface';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { Router } from '@angular/router';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { SingleSelectComponent } from '../single-select/single-select.component';
import { MultipleSelectComponent } from '../multiple-select/multiple-select.component';
import { CompleteWordComponent } from '../complete-word/complete-word.component';
import { OrderWordsComponent } from '../order-words/order-words.component';
import { TrueOrFalseComponent } from '../true-or-false/true-or-false.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';

@Component({
  selector: 'app-new-activity-container',
  standalone: true,
  imports: [
    FontAwesomeModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    SpinnerComponent,
    SingleSelectComponent,
    MultipleSelectComponent,
    CompleteWordComponent,
    OrderWordsComponent,
    TrueOrFalseComponent
  ],
  providers: [
    ModulesService,
    SweetAlertsConfirm
  ],
  templateUrl: './new-activity-container.component.html',
  styleUrl: './new-activity-container.component.css'
})
export class NewActivityContainerComponent {

  //variables
  spinnerStatus: boolean = false;
  arrayModules: DataAllModulesIT[] = [];
  filteredModulesTitle: DataAllModulesIT[] = [];
  optionActivity: string = "";
  newActivityForm!: FormGroup;
  moduleID: number = 0;

  //constructor
  constructor(
    private modulesServiceP: ModulesService,
    private sweetAlerts: SweetAlertsConfirm,
    private toastr: ToastAlertsService,
    private formBuilder: FormBuilder,
    private router: Router
  ) { }

  //ngOnInit
  ngOnInit() {
    this.moduleID = 0;
    this.getListAllModules();
    this.createNewModuleForm();
  }

  //Método que crea el formulario para crear un módulo
  createNewModuleForm() {
    this.newActivityForm = this.formBuilder.group({
      moduleID: ['', Validators.required],
      typeQuestion: ['', Validators.required],
    });
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para obtener el listado de tódos los módulos disponibles
  getListAllModules() {
    this.spinnerStatus = false;
    this.modulesServiceP.getAllListModules(this.getHeaders(), 1, 999, "id", "desc")
      .subscribe({
        next: (data: ApiResponseAllModulesIT) => {
          this.arrayModules = data.data;
          this.spinnerStatus = true;
        },
        error: (error) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el listado de módulos");
        }
      });
  }

  //Método para buscar el modulo, entre las opciones del select
  onSearchModule(event: any) {
    const value = event.target.value;
    const searchTerm = value.trim().toLowerCase();
    this.filteredModulesTitle = this.arrayModules.filter(
      module => (module.title).toLowerCase().includes(searchTerm)
    );
  }

  //Método para mostrar por defecto todos los módulos y que no se muestre de primero el "Sin resultados..."
  onFocus() {
    this.filteredModulesTitle = this.arrayModules;
  }

  //Método que actualiza el valor de la variable optionActivity para determinar el tipo de actividad a registrar
  updateOptionActivity(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target) {
      this.optionActivity = target.value;
    }
  }

  //Método que redirecciona al componente de listar las actividades por módulo
  goToListActivities() {
   this.sweetAlerts.alertConfirmCancelQuestion("Abandonar", "¿Deseas abandonar esta página? Si lo haces y no has guardado la información, es posible que los cambios no se guarden.").then(respuesta => {
      if (respuesta.value) {
        this.spinnerStatus = false;
        this.router.navigateByUrl("/teacher/home/activities/list-activities");
        this.spinnerStatus = true;
      }
    });
  }

  //Método que captura el id del módulo seleccionado
  captureModuleId(moduleId: number) {
    this.moduleID = moduleId;
  }


  //Icons to use
  iconActivities = iconos.faIcons;
  iconBack = iconos.faArrowLeft;
}
