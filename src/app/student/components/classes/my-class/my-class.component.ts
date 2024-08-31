import { Component } from '@angular/core';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { JoinToClassComponent } from '../modals/join-to-class/join-to-class.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClassesService } from '../../../services/classes.service';
import { ApiResponseListClassesI } from '../../../interfaces/classes';
import { ViewClassDetailComponent } from '../modals/view-class-detail/view-class-detail.component';
import { ViewStudentsComponent } from '../modals/view-students/view-students.component';
import { SweetAlertsConfirm } from '../../../../shared-components/alerts/confirm-alerts.component';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { MyEvaluationsComponent } from '../my-evaluations/my-evaluations.component';

@Component({
  selector: 'app-my-class',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    FontAwesomeModule,
    JoinToClassComponent,
    HttpClientModule,
    ViewClassDetailComponent,
    ViewStudentsComponent,
    MyEvaluationsComponent
  ],
  providers: [
    ClassesService,
    SweetAlertsConfirm
  ],
  templateUrl: './my-class.component.html',
  styleUrls: ['./my-class.component.css', '../../learn/modules/modules.component.css']
})
export class MyClassComponent {

  //Variables
  spinnerStatus: boolean = false;
  arrayClasses: ApiResponseListClassesI[] = [];

  //constructor
  constructor(
    private modal: NgbModal,
    private classesService: ClassesService,
    private sweetAlerts: SweetAlertsConfirm,
    private toastr: ToastAlertsService,
    private router: Router
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.getListClassesStudent();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para obtener el listado de clases
  getListClassesStudent() {
    this.spinnerStatus = false;
    this.classesService.getListClassesStudent(this.getHeaders())
      .subscribe({
        next: (data: ApiResponseListClassesI[]) => {
          this.arrayClasses = data;
          this.spinnerStatus = true;
        },
        error: error => {
          this.spinnerStatus = true;
        }
      })
  }

  //Método que abre el listado de evaluaciones
  goToEvaluations() {
    this.router.navigateByUrl('/student/home/classes/my-evaluations');
  }

  //Método que abre el modal para unirse a una clase
  openModalJoinToClass(joinToClass: any) {
    this.modal.open(joinToClass, { size: 'md', centered: true });
  }

  //Método que abre el modal para ver los detalles de una clase
  openModalViewClassDetail(viewClassDetail: any, classinfo: ApiResponseListClassesI) {
    this.modal.open(viewClassDetail, { size: 'md', centered: true });
    ViewClassDetailComponent.classDetail = classinfo;
  }

  //Método que abre el modal para ver los estudiantes de una clase
  openModalViewStudents(viewStudents: any, classID: number) {
    this.modal.open(viewStudents, { size: 'lg', centered: true });
    ViewStudentsComponent.classID = classID;
  }

  //Método que muestra un alert para confirmar si el estudiante desea abandonar la clase
  showAlertLeaveClass(classID: number) {
    this.sweetAlerts.alertConfirmCancelQuestion("Abandonar clase", "¿Estás seguro de querer abandonar la clase?").then(respuesta => {
      if (respuesta.value == true) {
        this.spinnerStatus = false;
        this.classesService.leaveClass(this.getHeaders(), classID)
        .subscribe({
          next: (data: any) => {
            if(data == "OK"){
              this.spinnerStatus = true;
              this.toastr.showToastSuccess("Ya no perteneces a la clase seleccionada", "¡Éxito!");
              this.getListClassesStudent();
            }
          },
          error: error => {
            this.spinnerStatus = true;
            this.toastr.showToastError("Error", "No se ha podido abandonar la clase seleccionada");
          }
        });
      }
    });
  }

  //Icons to use
  iconMyClass = iconos.faChalkboardUser;
  iconTitle = iconos.faCube;
  iconAdd = iconos.faCirclePlus;
  iconStudents = iconos.faUsers;
  iconViewDetails = iconos.faEye;
  iconLeaveClass = iconos.faSignOutAlt
  iconProfessor = iconos.faUserGraduate;
  iconCourse = iconos.faCube;
  iconCalendar = iconos.faCalendarAlt;
}
