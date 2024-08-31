import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModulesService } from '../../../services/modules.service';
import { ApiResponseAllModulesIT, BodyCreateModuleIT, DataAllModulesIT } from '../../../interfaces/modules.interface';
import { environment } from '../../../../../environments/environment';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { SearchRegistersPipe } from '../../../../shared-components/pipes/search-registers.pipe';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { Router } from '@angular/router';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import * as XLSX from 'xlsx';
import { EditModuleComponent } from '../edit-module/edit-module.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ViewDetailsComponent } from '../modals/view-details/view-details.component';
import { ViewActivitiesComponent } from '../modals/view-activities/view-activities.component';

@Component({
  selector: 'app-list-modules',
  standalone: true,
  imports: [
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    SpinnerComponent,
    SearchRegistersPipe,
    ViewDetailsComponent,
    ViewActivitiesComponent
  ],
  providers: [
    ModulesService,
  ],
  templateUrl: './list-modules.component.html',
  styleUrl: './list-modules.component.css'
})
export class ListModulesComponent {

  //Variables
  arrayModules: DataAllModulesIT[] = [];
  modulesToSearch: DataAllModulesIT[] = [];
  arrayPaginator: number[] = [];
  itemsForPage: number = environment.ITEMS_FOR_PAGE_TABLES;
  totalPage: number = environment.TOTAL_PAGES;
  currentPage: number = 1;
  statusFilter: string = "for-me";
  spinnerStatus: boolean = false;
  searchBy: string = environment.SEARCH_BY;


  //constructor
  constructor(
    private modulesServiceP: ModulesService,
    private toastr: ToastAlertsService,
    private router: Router,
    private modal: NgbModal
  ) { }


  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.getListModulesCreatedForMe(this.currentPage, this.itemsForPage);
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que cambia el filtro entre los módulos creados por el profesor logueado y todos los módulos
  onFilterChange(event: any) {
    if (event.target.value === "for-me") {
      this.arrayModules = [];
      this.totalPage = 0;
      this.currentPage = 1;
      this.statusFilter = "for-me";
      this.getListModulesCreatedForMe(this.currentPage, this.itemsForPage);
    }
    else if (event.target.value === "all-modules") {
      this.arrayModules = [];
      this.totalPage = 0;
      this.currentPage = 1;
      this.statusFilter = "all-modules";
      this.getListAllModules(this.currentPage, this.itemsForPage);
    }
  }

  //Método para manejar el cambio de página
  pageChanged(page: number) {
    this.currentPage = page;
    if (this.statusFilter === "for-me")
      this.getListModulesCreatedForMe(this.currentPage, this.itemsForPage);
    else if (this.statusFilter === "all-modules")
      this.getListAllModules(this.currentPage, this.itemsForPage);
  }

  //Para la paginación
  setPaginator() {
    this.arrayPaginator = [];
    for (let i = 0; i < this.totalPage; i++) {
      this.arrayPaginator.push(i + 1);
    }
  }

  //Método que obtiene el listado de módulos creados por el profesor logueado
  getListModulesCreatedForMe(currentPage: number, itemsForpage: number) {
    this.spinnerStatus = false;
    this.modulesServiceP.getListModulesForProfesor(this.getHeaders(), currentPage, itemsForpage, "id", "desc")
      .subscribe({
        next: (data: ApiResponseAllModulesIT) => {
          this.arrayModules = data.data;
          this.totalPage = data.details.total_page;
          this.setPaginator();
          this.spinnerStatus = true;
        },
        error: (error) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el listado de módulos");
        }
      });
  }

  //Método que consume el servicio para obtener el listado de tódos los módulos disponibles
  getListAllModules(currentPage: number, itemsForpage: number) {
    this.spinnerStatus = false;
    this.modulesServiceP.getAllListModules(this.getHeaders(), currentPage, itemsForpage, "id", "desc")
      .subscribe({
        next: (data: ApiResponseAllModulesIT) => {
          this.arrayModules = data.data;
          this.totalPage = data.details.total_page;
          this.setPaginator();
          this.spinnerStatus = true;
        },
        error: (error) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el listado de módulos");
        }
      });
  }

  //Método que descarga un archivo de Excel con los datos de la tabla
  downloadXLSX() {
    const table = document.getElementById('htmlExcelTable') as HTMLElement;
    const rows: any = [];
    const tableRows = table.querySelectorAll('tr');
    tableRows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      const rowData: any = [];
      cells.forEach((cell, cellIndex) => {
        rowData.push((cell as HTMLElement).innerText);
      });
      rows.push(rowData);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mis-Tareas');
    XLSX.writeFile(workbook, `${this.getCurrentDate()}_mis_tareas.xlsx`);
  }

  //Método que obtiene la fecha actual para mostrarla en el archivo PDF
  getCurrentDate(): string {
    const fechaActual = new Date();
    return `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  }

  //Método que redigire al componente de crear un nuevo módulo
  goToListModules() {
    this.router.navigateByUrl("teacher/home/modules/create-module");
  }

  //Método que redirige al componente de editar pasando toda la data del módulo seleccionada
  editModule(module: BodyCreateModuleIT, moduleID: number) {
    EditModuleComponent.module = module;
    EditModuleComponent.moduleID = moduleID;
    this.router.navigateByUrl("teacher/home/modules/edit-module");
  }

  //Método que abre el modal para mostrar más información del módulo seleccionado
  openModalViewModuleDetails(viewModuleDetail: any, moduleID: number) {
    ViewDetailsComponent.moduleID = moduleID;
    this.modal.open(viewModuleDetail, { size: 'lg', centered: true });
  }

  //Método que abre el modal para mostrar las actividades de un módulo seleccionado
  openModalViewActivities(viewActivities: any, moduleID: number) {
    ViewActivitiesComponent.moduleID = moduleID;
    this.modal.open(viewActivities, { size: 'xl', centered: true });
  }

  //Icons to use
  iconModules = iconos.faCubes;
  iconAdd = iconos.faCirclePlus;
  iconXlsx = iconos.faFileExcel;
  //Icons for paginator
  iconBack = iconos.faArrowLeft;
  iconNext = iconos.faArrowRight;
  //Icons for table
  iconViewDetails = iconos.faEye;
  iconViewActivities = iconos.faIcons;
  iconEdit = iconos.faEdit;
  iconPublic = iconos.faEarthAmericas;
  iconPrivate = iconos.faLock;
}
