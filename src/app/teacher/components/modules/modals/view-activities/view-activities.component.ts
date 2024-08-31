import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiResponseListActivitiesIT, DetailActivityByModuleIT } from '../../../../interfaces/activities.interface';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchRegistersPipe } from '../../../../../shared-components/pipes/search-registers.pipe';
import { environment } from '../../../../../../environments/environment';
import { ActivitiesService } from '../../../../services/activities.service';
import { ToastAlertsService } from '../../../../../shared-components/services/toast-alerts.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-activities',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    SearchRegistersPipe
  ],
  providers: [
    ActivitiesService
  ],
  templateUrl: './view-activities.component.html',
  styleUrl: './view-activities.component.css'
})
export class ViewActivitiesComponent {

  //Variables
  static moduleID: number = 0;
  spinnerStatus: boolean = false;
  arrayActivities: DetailActivityByModuleIT[] = [];
  activitiesToSearch: DetailActivityByModuleIT[] = [];
  searchBy: string = "text_root";
  arrayPaginator: number[] = [];
  itemsForPage: number = 7;
  totalPage: number = environment.TOTAL_PAGES;
  currentPage: number = 1;

  //contructor
  constructor(
    public modal: NgbModal,
    private activitiesService: ActivitiesService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.getActivitiesByModule(ViewActivitiesComponent.moduleID, this.currentPage, this.itemsForPage);
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que obtiene el listado de actividades de un módulo según el ID
  getActivitiesByModule(moduleID: number, currentPage: number, itemsForPage: number) {
    this.spinnerStatus = false;
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
    this.getActivitiesByModule(ViewActivitiesComponent.moduleID, this.currentPage, this.itemsForPage);
  }

  //Icons to user
  iconActivities = iconos.faIcons;
    //Icons for paginator
    iconBack = iconos.faArrowLeft;
    iconNext = iconos.faArrowRight;
}
