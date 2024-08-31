import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModulesService } from '../../../../services/modules.service';
import { ListModulesComponent } from '../../list-modules/list-modules.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DataAllModulesIT } from '../../../../interfaces/modules.interface';
import { CommonModule } from '@angular/common';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-view-details',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule
  ],
  providers: [
    ModulesService
  ],
  templateUrl: './view-details.component.html',
  styleUrl: './view-details.component.css'
})
export class ViewDetailsComponent {
  //Variables
  static moduleID: number = 0
  moduleIdLocal: number = 0;
  moduleDetail: DataAllModulesIT = {} as DataAllModulesIT;

  //Constructor
  constructor(
    public modal: NgbModal,
    private modulesService: ModulesService,
    private modules: ListModulesComponent
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.moduleIdLocal = ViewDetailsComponent.moduleID;
    this.getModuleDetailById(this.moduleIdLocal);
  }

  //Método que obtiene la información del módulo por ID
  getModuleDetailById(moduleId: number) {
    this.modulesService.getModuleById(this.modules.getHeaders(), moduleId)
      .subscribe({
        next: (resp: DataAllModulesIT) => {
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
