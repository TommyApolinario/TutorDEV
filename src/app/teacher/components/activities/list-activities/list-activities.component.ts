import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingleSelectComponent } from '../single-select/single-select.component';
import { OrderWordsComponent } from '../order-words/order-words.component';
import { TrueOrFalseComponent } from '../true-or-false/true-or-false.component';
import { CompleteWordComponent } from '../complete-word/complete-word.component';
import { MultipleSelectComponent } from '../multiple-select/multiple-select.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { ApiResponseListActivitiesIT, ApiResponseRegisterQuestionIT, DetailActivityByModuleIT } from '../../../interfaces/activities.interface';
import { ApiResponseAllModulesIT, DataAllModulesIT } from '../../../interfaces/modules.interface';
import { ModulesService } from '../../../services/modules.service';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { ActivitiesService } from '../../../services/activities.service';
import { SearchRegistersPipe } from '../../../../shared-components/pipes/search-registers.pipe';
import { environment } from '../../../../../environments/environment';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as XLSX from 'xlsx';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-list-activities',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SpinnerComponent,
    SearchRegistersPipe,
    MatAutocompleteModule,
    MatInputModule
  ],
  providers: [
    ModulesService,
    ActivitiesService,
    SweetAlertsConfirm
  ],
  templateUrl: './list-activities.component.html',
  styleUrls: ['./list-activities.component.css', '../../modules/list-modules/list-modules.component.css']
})
export class ListActivitiesComponent {

  //Variables
  spinnerStatus: boolean = false;
  arrayActivities: DetailActivityByModuleIT[] = [];
  activitiesToSearch: DetailActivityByModuleIT[] = [];
  arrayPaginator: number[] = [];
  itemsForPage: number = environment.ITEMS_FOR_PAGE_TABLES;
  totalPage: number = environment.TOTAL_PAGES;
  currentPage: number = 1;
  searchBy: string = "text_root";

  filteredModulesTitle: DataAllModulesIT[] = [];
  arrayModules: DataAllModulesIT[] = [];
  moduleID: number = 0;
  questionData: ApiResponseRegisterQuestionIT = {} as ApiResponseRegisterQuestionIT;

  //Constructor
  constructor(
    private modulesServiceP: ModulesService,
    private toastr: ToastAlertsService,
    private sweetAlerts: SweetAlertsConfirm,
    private router: Router,
    private activitiesService: ActivitiesService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.getListAllModules();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que redirige al componente de crear una nueva actividad
  goToAddActivity() {
    this.router.navigateByUrl('/teacher/home/activities/new-activity');
  }

  //Método que descarga un archivo de Excel con los datos de la tabla
  downloadXLSX() {
    if (this.moduleID == 0) {
      this.toastr.showToastInformation("Información", "Primero debe seleccionar un módulo");
      return;
    }
    const table = document.getElementById('htmlExcelTable') as HTMLElement;
    const rows: any = [];
    const tableRows = table.querySelectorAll('tr');
    tableRows.forEach((row) => {
      const cells = row.querySelectorAll('td, th');
      const rowData: any = [];
      cells.forEach((cell) => {
        rowData.push((cell as HTMLElement).innerText);
      });
      rows.push(rowData);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Actividades');
    XLSX.writeFile(workbook, `${this.getCurrentDate()}_actividades_modulo_${this.moduleID}.xlsx`);
  }

  //Método que obtiene la fecha actual para mostrarla en el archivo de Excel
  getCurrentDate(): string {
    const fechaActual = new Date();
    return `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
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
        error: () => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el listado de módulos");
        }
      });
  }

  //Para la paginación
  setPaginator() {
    this.arrayPaginator = [];
    for (let i = 0; i < this.totalPage; i++) {
      this.arrayPaginator.push(i + 1);
    }
  }

  //Método para manejar el cambio de página
  pageChanged(page: number) {
    this.currentPage = page;
    this.getActivitiesByModule(this.moduleID, this.currentPage, this.itemsForPage);
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

  //Método que obtiene el listado de actividades de un módulo según el ID
  getActivitiesByModule(moduleID: number, currentPage: number, itemsForPage: number) {
    this.spinnerStatus = false;
    this.moduleID = moduleID;
    this.activitiesService.getActivitiesByModule(this.getHeaders(), currentPage, itemsForPage, "id", "asc", moduleID)
      .subscribe({
        next: (data: ApiResponseListActivitiesIT) => {
          this.arrayActivities = data.data;
          this.totalPage = data.details.total_page;
          this.setPaginator();
          this.spinnerStatus = true;
          if (this.arrayActivities.length == 0) {
            this.toastr.showToastInformation("Información", "Este módulo no contiene actividades registradas");
          }
        },
        error: () => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el listado de actividades");
        }
      });
  }

  //Método que obtiene la data de una pregunta por su ID
  goToEditActivity(activityID: number) {
    this.spinnerStatus = false;
    this.activitiesService.getQuestionById(this.getHeaders(), activityID)
      .subscribe({
        next: (data: ApiResponseRegisterQuestionIT) => {
          /* this.questionData = data; */
          this.spinnerStatus = true;
          switch (data.type_question) {
            case ("multi_choice_text"):
              if (data.options.select_mode == "single") {
                this.router.navigateByUrl("/teacher/home/activities/edit-activity-single-selection")
                SingleSelectComponent.activityID = activityID;
                SingleSelectComponent.moduleID = this.moduleID;
                SingleSelectComponent.correctAnswerID = data.correct_answer_id;
              }
              else {
                this.router.navigateByUrl("/teacher/home/activities/edit-activity-multiple-selection")
                MultipleSelectComponent.activityID = activityID;
                MultipleSelectComponent.moduleID = this.moduleID;
                MultipleSelectComponent.correctAnswerID = data.correct_answer_id;
              }
              break;
            case ("order_word"):
              this.router.navigateByUrl("/teacher/home/activities/edit-activity-order-word")
              OrderWordsComponent.activityID = activityID;
              OrderWordsComponent.moduleID = this.moduleID;
              OrderWordsComponent.correctAnswerID = data.correct_answer_id;
              break;
            case ("true_or_false"):
              this.router.navigateByUrl("/teacher/home/activities/edit-activity-true-or-false")
              TrueOrFalseComponent.activityID = activityID;
              TrueOrFalseComponent.moduleID = this.moduleID;
              TrueOrFalseComponent.correctAnswerID = data.correct_answer_id;
              break;
            case ("complete_word"):
              this.router.navigateByUrl("/teacher/home/activities/edit-activity-complete-word")
              CompleteWordComponent.activityID = activityID;
              CompleteWordComponent.moduleID = this.moduleID;
              CompleteWordComponent.correctAnswerID = data.correct_answer_id;
              break;
          }
        },
        error: () => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "Ocurrió un error al obtener la pregunta");
        }
      })
  }

  //Método que consume el servicio que elimina una pregunta
  deleteQuestion(activityID: number){
    this.sweetAlerts.alertConfirmCancelQuestion("Eliminar actividad", "¿Estás seguro de eliminar esta actividad? Esta acción es irreversible").then(respuesta => {
      if (respuesta.value) {
        this.spinnerStatus = false;
        this.activitiesService.deleteQuestion(this.getHeaders(), this.moduleID, activityID)
          .subscribe({
            next: () => {
              this.spinnerStatus = true;
              this.toastr.showToastSuccess("Pregunta eliminada correctamente", "Éxito");
              this.getActivitiesByModule(this.moduleID, this.currentPage, this.itemsForPage);
            },
            error: (error: any) => {
              this.spinnerStatus = true;
              if (error.status === 200 && error.statusText === "OK") {
                this.toastr.showToastSuccess("Pregunta eliminada correctamente", "Éxito");
                this.getActivitiesByModule(this.moduleID, this.currentPage, this.itemsForPage);
              } else {
                this.toastr.showToastError("Error", "Ocurrió un error al actualizar la pregunta");
              }
            }
          })
      }
    });
  }

  //Icons to use
  iconActivities = iconos.faIcons;
  iconAdd = iconos.faCirclePlus;
  iconXlsx = iconos.faFileExcel;
  //Icons for table
  iconEdit = iconos.faEdit;
  iconDelete = iconos.faTrashAlt;
  //Icons for paginator
  iconBack = iconos.faArrowLeft;
  iconNext = iconos.faArrowRight;
}
