import { UserProfileService } from './../services/user-profile.service';
import { Component } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastAlertsService } from '../services/toast-alerts.service';
import { ApiResponsePhotoProfileI } from '../interfaces/photo-profile';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { ApiResponseGetInfoUserI, UpdateUserProfileI } from '../interfaces/user-profile';

@Component({
  selector: 'app-upload-photo-profile',
  standalone: true,
  imports: [
    SpinnerComponent,
    FontAwesomeModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    UserProfileService
  ],
  templateUrl: './upload-photo-profile.component.html',
  styleUrl: './upload-photo-profile.component.css'
})
export class UploadPhotoProfileComponent {

  //Variables
  spinnerStatus: boolean = true;
  photoForm!: FormGroup;
  imageUrl: string = "";
  urlAvatar: string = "";
  infoUser: ApiResponseGetInfoUserI = {} as ApiResponseGetInfoUserI;

  //Constructor
  constructor(
    public modal: NgbModal,
    public formBuilder: FormBuilder,
    private userProfileService: UserProfileService,
    private toastr: ToastAlertsService,
  ) { }

  //ngOnInit
  ngOnInit() {
    this.createUploadVideoForm();
    this.getInfoUser();
  }

  //ngAfterViewInit
  ngAfterViewInit() {
    this.openFileExplorer();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que crea el formulario para subir la foto
  createUploadVideoForm() {
    this.photoForm = this.formBuilder.group({
      file: [null,
        [Validators.required],
      ],
    });
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar si es una imagen
      if (file.type.match(/image\/*/) != null) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
          this.imageUrl = event.target?.result as string;
          this.photoForm.patchValue({ video: file });
          this.photoForm.get("file")?.updateValueAndValidity();
        };
      } else {
        this.toastr.showToastError('Error', 'Por favor seleccione un archivo de imagen válido (png, jpeg, jpg)');
      }
    }
  }

  //Método que abre el explorador de archivos para subir un video
  openFileExplorer() {
    const selectVideo = document.querySelector('#container-video') as HTMLInputElement;
    const inputFile = document.querySelector('#file') as HTMLInputElement;
    const videoArea = document.querySelector('.video-area') as HTMLElement;
    selectVideo.addEventListener('click', function () {
      inputFile.click();
    });

    inputFile.addEventListener('change', () => {
      if (inputFile.files && inputFile.files.length > 0) {
        const video = inputFile.files[0];
        if (video.size < 20000000) {
          const reader = new FileReader();
          reader.onload = () => {
            const allVideos = videoArea.querySelectorAll('video');
            allVideos.forEach((item) => item.remove());
            const videoUrl = reader.result as string;
            const videoElement = document.createElement('video');
            videoElement.src = videoUrl;
            videoElement.controls = true;
            videoArea.appendChild(videoElement);
            videoArea.classList.add('active');
            videoArea.dataset['video'] = video.name;
          };
          reader.readAsDataURL(video);
        } else {
          this.toastr.showToastError('Error', 'El video no puede pesar más de 2MB');
        }
      }
    });
  }

  //Método que consume el servicio que sube la foto a google para luego ser guardada en la base de datos
  uploadPhotoToGoogle() {
    const formData = new FormData();
    let image: File = this.photoForm.get('file')?.value;
    if (image) {
      this.spinnerStatus = false;
      const fileName = `${Date.now()}_${image.name}`;
      const fileBlob = new Blob([image], { type: image.type });
      formData.append("file", fileBlob, fileName);
      this.userProfileService.uploadPhotoToGoogle(this.getHeaders(), formData)
        .subscribe({
          next: (data: ApiResponsePhotoProfileI) => {
            this.spinnerStatus = true;
            this.urlAvatar = data.url;
            //this.editUserInformation();
            this.toastr.showToastSuccess("Foto actualizada con éxito", "Éxito");
            this.photoForm.reset();
            this.modal.dismissAll();
          },
          error: (error) => {
            this.spinnerStatus = true;
            this.toastr.showToastError("Error", "No se ha podido subir la foto");
          }
        });
    } else {
      this.spinnerStatus = true;
      this.toastr.showToastError("Error", "Debe adjuntar una foto");
    }
  }

  //Método que obtiene la información del usuario
  getInfoUser() {
    this.spinnerStatus = false;
    this.userProfileService.getInfoUser(this.getHeaders()).subscribe({
      next: (data: ApiResponseGetInfoUserI) => {
        this.spinnerStatus = true;
        this.infoUser = data;
      },
      error: (error) => {
        this.spinnerStatus = true;
        this.toastr.showToastError("Error", "Ocurrió un error al obtener la información del usuario");
      }
    })
  }

  //Método que guarda la información del usuario luego de editarla en los campos
  editUserInformation() {
    this.spinnerStatus = false;
    let body: UpdateUserProfileI = {
      first_name: this.infoUser.first_name,
      last_name: this.infoUser.last_name,
      birth_date: this.infoUser.birth_date,
      whatsapp: this.infoUser.whatsapp,
      telegram: this.infoUser.telegram,
      url_avatar: this.urlAvatar
    }
    this.userProfileService.editInfoUser(this.getHeaders(), body).subscribe({
      next: (data: any) => {
        this.spinnerStatus = true;
        this.getInfoUser();
      },
      error: (error) => {
        if (error.status == 200) {
          this.spinnerStatus = true;
          this.getInfoUser();
        } else {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "Respuesta inesperada del servidor");
        }
      }
    })
  }

  //Icons to use
  iconPhotoProfile = iconos.faImage;
  iconUploadVideo = iconos.faUpload;
}
