import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { SpinnerComponent } from '../../../../../shared-components/spinner/spinner.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreatedByI } from '../../../../interfaces/modules';
import { ClassesService } from '../../../../services/classes.service';
import { MyClassComponent } from '../../my-class/my-class.component';
import { ApiResponseListsStudentsI } from '../../../../interfaces/classes';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { environment } from '../../../../../../environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchRegistersPipe } from '../../../../../shared-components/pipes/search-registers.pipe';

@Component({
  selector: 'app-view-students',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    SpinnerComponent,
    MatPaginatorModule,
    SearchRegistersPipe
  ],
  templateUrl: './view-students.component.html',
  styleUrl: './view-students.component.css'
})
export class ViewStudentsComponent {

  //Variables
  static classID: number = 0;
  spinnerStatus: boolean = false;
  arrayStudents: CreatedByI[] = [];
  studentsToSearch: CreatedByI[] = [];
  searchBy: string = environment.SEARCH_STUDENT_BY;

  //Constructor
  constructor(
    public modal: NgbModal,
    private classesService: ClassesService,
    private classesComponent: MyClassComponent,
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.getStudents();
  }

  //Método que consume el servicio para obtener el listado de estudiantes de la clase
  getStudents() {
    this.spinnerStatus = false;
    this.classesService.getStudents(this.classesComponent.getHeaders(), ViewStudentsComponent.classID)
      .subscribe({
        next: (data: ApiResponseListsStudentsI) => {
          this.arrayStudents = data.students;
          this.spinnerStatus = true;
        },
        error: (error: any) => {
          alert(error);
        }
      })
  }

  //Icons to use
  codeClass = iconos.faChalkboardUser;
}
