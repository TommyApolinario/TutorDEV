import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ModulesComponent } from '../../learn/modules/modules.component';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { ApiResponseSubscribeToModuleI, SubscribeToModuleI } from '../../../interfaces/subscribed-modules';
import { SubscribedModulesService } from '../../../services/subscribed-modules.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-subscribe-to-module',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    ToastrModule,
    ReactiveFormsModule,
    SpinnerComponent
  ],
  providers: [
    SubscribedModulesService
  ],
  templateUrl: './subscribe-to-module.component.html',
  styleUrl: './subscribe-to-module.component.css'
})
export class SubscribeToModuleComponent {
  //Variables
  codeForm!: FormGroup;
  spinnerStatus: boolean = false;

  /*Constructor*/
  constructor(
    public modal: NgbModal,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private suscribeToModuleService: SubscribedModulesService,
    private modules: ModulesComponent
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.spinnerStatus = true;
    this.createRegisterForm();
  }

  //Método que crea el formulario con el campo de código
  createRegisterForm() {
    this.codeForm = this.formBuilder.group({
      codeModule: ['',
        [
          Validators.required,
        ],
      ],
    });
  }

  //Método que consume el servicio para que el estudiante se suscriba a un módulo{
  subscribeToModule() {
    this.spinnerStatus = false;
    let body: SubscribeToModuleI = {
      code: this.codeForm.get('codeModule')?.value
    }
    this.suscribeToModuleService.subscribeToModule(this.modules.getHeaders(), body).subscribe(
      (data: ApiResponseSubscribeToModuleI) => {
        this.spinnerStatus = false;
        if(data.status == 'success'){
          this.spinnerStatus = true;
          this.modal.dismissAll();
          this.toastr.success("Se ha suscrito correctamente", "¡Éxito!");
        }
        else{
          this.spinnerStatus = true;
          this.toastr.error("Código incorrecto o el módulo no existe", "¡Error!");
        }
      },
      (error: any) => {
        this.spinnerStatus = true;
        this.modal.dismissAll();
        this.toastr.error(error.error.message, "¡Error!");
      }
    );
  }

  //Icons to use
  iconModules = iconos.faCubesStacked;
}
