import { ApiResponseListClassesI } from './../../../../interfaces/classes';
import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-class-detail',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './view-class-detail.component.html',
  styleUrl: './view-class-detail.component.css'
})
export class ViewClassDetailComponent {

  //Variables
  static classDetail: ApiResponseListClassesI = {} as ApiResponseListClassesI;
  classDetailLocal: ApiResponseListClassesI = {} as ApiResponseListClassesI;

  //Constructor
  constructor(
    public modal: NgbModal
  ){}

  //ngOnInit
  ngOnInit(){
    this.classDetailLocal = ViewClassDetailComponent.classDetail;
  }


  //Icons to use
  iconClass = iconos.faChalkboardUser;
  iconArrowRight = iconos.faCaretRight;
}
