import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserI } from '../../../../interfaces/users.interface';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-view-users-detail',
  standalone: true,
  imports: [
    FontAwesomeModule,
  ],
  templateUrl: './view-users-detail.component.html',
  styleUrl: './view-users-detail.component.css'
})
export class ViewUsersDetailComponent {

  //Variables
  static User: UserI = {} as UserI;
  userDetail: UserI = {} as UserI;

  //constructor
  constructor(
    public modal: NgbModal,
  ){}
  
  //ngOnInit()
  ngOnInit(){
    this.userDetail = ViewUsersDetailComponent.User;
  }
  //Iconos
  iconUser = iconos.faUser;
  iconArrowRight = iconos.faCaretRight;
}
