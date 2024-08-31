import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModulesComponent } from '../../learn/modules/modules.component';
import { DataAllModulesI } from '../../../interfaces/modules';
import { ModulesService } from '../../../services/modules.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-module-detail',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  providers:[
    ModulesService
  ],
  templateUrl: './view-module-detail.component.html',
  styleUrl: './view-module-detail.component.css'
})
export class ViewModuleDetailComponent {
  //Variables
  static moduleID: number = 0
  moduleIdLocal: number = 0;
  moduleDetail: DataAllModulesI = {} as DataAllModulesI;

  //Constructor
  constructor(
    public modal: NgbModal,
    private modulesService: ModulesService,
    private modules: ModulesComponent
  ){}

  //ngOnInit()
  ngOnInit(){
    this.moduleIdLocal = ViewModuleDetailComponent.moduleID;
    this.getModuleDetailById(this.moduleIdLocal);
  }

  //Método que obtiene la información del módulo por ID
  getModuleDetailById(moduleId: number){
    this.modulesService.getModuleById(this.modules.getHeaders(), moduleId)
    .subscribe({
      next: (resp: DataAllModulesI) => {
        this.moduleDetail = resp;
      }
    });
  }

  //Icons to user
  iconModule = iconos.faCubes;
  iconArrowRight = iconos.faCaretRight;
  iconPublic = iconos.faEarthAmericas;
  iconPrivate = iconos.faLock;

}
