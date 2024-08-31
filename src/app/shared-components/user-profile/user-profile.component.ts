import { Component } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserProfileService } from '../services/user-profile.service';
import { ApiResponseGetInfoUserI, UpdateUserProfileI } from '../interfaces/user-profile';
import { ToastAlertsService } from '../services/toast-alerts.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { UploadPhotoProfileComponent } from '../upload-photo-profile/upload-photo-profile.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    SpinnerComponent,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    UploadPhotoProfileComponent
  ],
  providers: [
    UserProfileService
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {

  //Variables
  spinnerStatus: boolean = false;
  infoUser: ApiResponseGetInfoUserI = {} as ApiResponseGetInfoUserI;

  isEdit: boolean = false;
  userProfileForm!: FormGroup;

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    public modal: NgbModal,
    private userProfileService: UserProfileService,
    private toastr: ToastAlertsService,
  ) { }

  //ngOnInit
  ngOnInit() {
    this.spinnerStatus = true;
    this.createUserProfileForm();
    this.getInfoUser();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para obtener la información del usuario
  getInfoUser() {
    this.spinnerStatus = false;
    this.userProfileService.getInfoUser(this.getHeaders()).subscribe({
      next: (data: ApiResponseGetInfoUserI) => {
        this.spinnerStatus = true;
        this.infoUser = data;
        console.log(this.infoUser)
        this.fillInputFields();
      },
      error: (error) => {
        this.spinnerStatus = true;
        this.toastr.showToastError("Error", "Ocurrió un error al obtener la información del usuario");
      }
    })
  }

  //Método que llena la información del usuario en los campos
  fillInputFields() {
    this.userProfileForm.get('first_name')?.setValue(this.infoUser.first_name);
    this.userProfileForm.get('last_name')?.setValue(this.infoUser.last_name);
    this.userProfileForm.get('whatsapp')?.setValue(this.infoUser.whatsapp);
    //Formateando la fecha de nacimiento
    const birthDateApiFormat = this.infoUser.birth_date;
    const parts = birthDateApiFormat.split('/');
    const birthDateFormatted = `${parts[2]}-${parts[1]}-${parts[0]}`;
    this.userProfileForm.get('birth_date')?.setValue(birthDateFormatted);
    this.userProfileForm.get('email')?.setValue(this.infoUser.email);
    this.userProfileForm.get('telegram')?.setValue(this.infoUser.telegram);
  }

  //Método que crea el formulario para crear un módulo
  createUserProfileForm() {
    this.userProfileForm = this.formBuilder.group({
      first_name: ['',
        [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ!@#$%^&*(),.: ]*$")],
      ],
      last_name: ['',
        [Validators.required, Validators.pattern("^[a-zA-ZáéíóúÁÉÍÓÚñÑ!@#$%^&*(),.: ]*$")],
      ],
      whatsapp: ['', Validators.required],
      birth_date: ['', Validators.required],
      email: [''],
      telegram: ['', Validators.required],
    });
  }

  //Método que cambia los botones para editar la información
  changeEdit() {
    if (this.isEdit)
      this.isEdit = false;
    else
      this.isEdit = true;
  }

  //Método que guarda la información del usuario luego de editarla en los campos
  editUserInformation() {
    this.spinnerStatus = false;
    let body: UpdateUserProfileI = {
      first_name: this.userProfileForm.get('first_name')?.value,
      last_name: this.userProfileForm.get('last_name')?.value,
      birth_date: this.infoUser.birth_date,
      whatsapp: this.userProfileForm.get('whatsapp')?.value,
      telegram: this.userProfileForm.get('telegram')?.value,
      url_avatar: this.infoUser.url_avatar
    }
    this.userProfileService.editInfoUser(this.getHeaders(), body).subscribe({
      next: (data: any) => {
        this.spinnerStatus = true;
        this.toastr.showToastSuccess("Información actualizada con éxito", "Éxito");
        this.isEdit = false;
      },
      error: (error) => {
        if (error.status == 200) {
          this.spinnerStatus = true;
          this.toastr.showToastSuccess("Información actualizada con éxito", "Éxito");
          this.isEdit = false;
          this.getInfoUser();
        } else {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "Respuesta inesperada del servidor");
        }
      }
    })
  }

  //Método que abre el modal para subir una foto
  openModalUploadPhoto(viewUserDetail: any) {
    this.modal.open(viewUserDetail, { size: 'md', centered: true });
  }

  //Método que cancela el modo de edición
  cancelEdit(){
    this.isEdit = false;
    this.getInfoUser();
  }

  //Icons to use
  iconMyProfile = iconos.faUserAlt;
  iconVerified = iconos.faCircleCheck;
  iconInformation = iconos.faList;
}
