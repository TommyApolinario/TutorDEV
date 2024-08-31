import { Component, Input } from '@angular/core';
import { ModulesService } from '../../../services/modules.service';
import { ApiResponseFinishLessonModuleI } from '../../../interfaces/lessons';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import { Router } from '@angular/router';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import * as AOS from 'aos';

@Component({
  selector: 'app-finish-activity',
  standalone: true,
  imports: [
    SpinnerComponent
  ],
  providers: [
    ModulesService
  ],
  templateUrl: './finish-activity.component.html',
  styleUrl: './finish-activity.component.css'
})
export class FinishActivityComponent {

  //Variables
  @Input() lessonID: number = 0;
  spinnerStatus: boolean = false;
  infoFinishLesson: ApiResponseFinishLessonModuleI = {} as ApiResponseFinishLessonModuleI;

  //constructor
  constructor(
    private router: Router,
    private modulesService: ModulesService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.finishLesson();
    AOS.init();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para finalizar la lección
  finishLesson() {
    this.spinnerStatus = false;
    this.modulesService.finishLesson(this.getHeaders(), this.lessonID)
      .subscribe({
        next: (data: ApiResponseFinishLessonModuleI) => {
          this.infoFinishLesson = data;
          this.spinnerStatus = true;
        },
        error: (error: any) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se ha podido guardar su lección");
        }
      })
  }

  //Método que redirige al estudiante a la página de listado de módulos
  goToListModules(){
    this.router.navigate(['student/home/learn/modules']);
  }
}
