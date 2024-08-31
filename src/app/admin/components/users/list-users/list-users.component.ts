import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { environment } from '../../../../../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchRegistersPipe } from '../../../../shared-components/pipes/search-registers.pipe';
import { UsersService } from '../../../services/users.service';
import { ApiResponseListUsersI, UserI } from '../../../interfaces/users.interface';
import { ViewUsersDetailComponent } from '../modals/view-users-detail/view-users-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import * as XLSX from 'xlsx';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';

@Component({
  selector: 'app-list-users',
  standalone: true,
  imports: [
    SpinnerComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule,
    SearchRegistersPipe,
    ViewUsersDetailComponent
  ],
  providers: [
    UsersService,
    SweetAlertsConfirm
  ],
  templateUrl: './list-users.component.html',
  styleUrl: './list-users.component.css'
})
export class ListUsersComponent {

  //Variables
  spinnerStatus: boolean = true;
  arrayUsers: UserI[] = [];
  usersToSearch: UserI[] = [];
  searchBy: string = environment.SEARCH_STUDENT_BY; 

  //constructor
  constructor(
    private usersService: UsersService,
    public modal: NgbModal,
    private toastr: ToastAlertsService,
    private sweetAlerts: SweetAlertsConfirm,
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.getListUsers();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para listar todos los usuarios
  getListUsers() {
    this.spinnerStatus = false;
    this.usersService.getListUsers(this.getHeaders()).subscribe({
      next: (data: ApiResponseListUsersI[]) => {
        this.spinnerStatus = true;
        this.arrayUsers = data;
      },
      error: (error) => {
        this.spinnerStatus = true;
        this.toastr.showToastError("Error", "No se pudo obtener el listado de usuarios");
      }
    })
  }

  //Método que genera un excel para descargar, del listado de usuarios
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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuario');
    XLSX.writeFile(workbook, `${this.getCurrentDate()}_usuarios.xlsx`);
  }

  //Método que obtiene la fecha actual para mostrarla en el archivo PDF
  getCurrentDate(): string {
    const fechaActual = new Date();
    return `${fechaActual.getDate()}/${fechaActual.getMonth() + 1}/${fechaActual.getFullYear()}`;
  }

  //Método que abre el modal para ver la información detallada de un usuario
  openModalViewInfoUser(viewUserDetail: any, userInfo: UserI){
    ViewUsersDetailComponent.User = userInfo;
    this.modal.open(viewUserDetail, { size: 'md', centered: true });
  }

  //Método que consume el servicio para aprobar un usuario
  approveUser(userID: number){
    this.sweetAlerts.alertConfirmCancelQuestion("Activar usuario", "¿Estás seguro de querer activar este usuario para admitirlo en Unidev? Aprobar al usuario hará que pueda realizar todas las funciones que están disponibles en esta aplicación, según su perfil de usuario.").then(respuesta => {
      if (respuesta.value) {
        this.spinnerStatus = false;
        this.usersService.approveUser(userID)
          .subscribe({
            next: () => {
              this.spinnerStatus = true;
              this.toastr.showToastSuccess("Usuario aprobado y aceptado con éxito", "Éxito");
            },
            error: (error: any) => {
              this.spinnerStatus = true;
              if (error.status === 200 && error.statusText === "OK") {
                this.toastr.showToastSuccess("Usuario aprobado y aceptado con éxito", "Éxito");
                this.getListUsers();
              } else {
                this.toastr.showToastError("Error", `Ocurrió un error al aprobar al usuario`);
              }
            }
          })
      }
    });
  }

  //Método que consume el servicio para desactivar un usuario (bloquear)
  desactivateUser(userID: number){
    this.sweetAlerts.alertConfirmCancelQuestion("Desactivar usuario", "¿Estás seguro de querer desactivar este usuario? Lo que se hará es bloquear al usuario para que ya no pueda acceder a las funciones de Unidev").then(respuesta => {
      if (respuesta.value) {
        this.spinnerStatus = false;
        this.usersService.desactivateUser(userID)
          .subscribe({
            next: () => {
              this.spinnerStatus = true;
              this.toastr.showToastSuccess("Usuario desactivado con éxito", "Éxito");
            },
            error: (error: any) => {
              this.spinnerStatus = true;
              if (error.status === 200 && error.statusText === "OK") {
                this.toastr.showToastSuccess("Usuario desactivado con éxito", "Éxito");
                this.getListUsers();
              } else {
                this.toastr.showToastError("Error", `Ocurrió un error al desactivar al usuario`);
              }
            }
          })
      }
    });
  }

  //Icons to use
  iconUsers = iconos.faUsers;
  iconXlsx = iconos.faFileExcel;
  //Icons for paginator
  iconBack = iconos.faArrowLeft;
  iconNext = iconos.faArrowRight;
  //Icons for table
  iconViewDetails = iconos.faEye;
  iconViewActivities = iconos.faIcons;
  iconActivate = iconos.faToggleOn
  iconDesactivate = iconos.faToggleOff;
}


