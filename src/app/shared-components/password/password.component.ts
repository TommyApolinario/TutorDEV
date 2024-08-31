import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SpinnerComponent } from '../spinner/spinner.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BodyChangePasswordInApp } from '../interfaces/password';
import { PasswordService } from '../services/password.service';
import { UserLoginI } from '../../auth/interfaces/login';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    CommonModule,
    SpinnerComponent,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    PasswordService
  ],
  templateUrl: './password.component.html',
  styleUrl: './password.component.css'
})
export class PasswordComponent {
  //Variables
  spinnerStatus: boolean = true;
  passwordForm!: FormGroup;
  showPassword: boolean = false;
  showPassword2: boolean = false;
  showPassword3: boolean = false;
  infoUser: UserLoginI = {} as UserLoginI;

  //constructor
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private passwordService: PasswordService
  ) { }


  //ngOnInit
  ngOnInit() {
    this.createPasswordForm();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que crea el formulario
  createPasswordForm() {
    this.passwordForm = this.formBuilder.group({
      currentPassword: ['',
        [
          Validators.required,
        ]
      ],
      newPassword: ['',
        [
          Validators.required,
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{6,}$/)
        ]
      ],
      confirmPassword: ['',
        [
          Validators.required,
        ]
      ],
    })
  }

  //Método que verifica que la nueva contraseña no sea igual a la anterior
  newPasswordMatchesCurrent() {
    const currentPasswordControl = this.passwordForm.get('currentPassword');
    const newPasswordControl = this.passwordForm.get('newPassword');

    if (currentPasswordControl && newPasswordControl) {
      const currentPassword = currentPasswordControl.value;
      const newPassword = newPasswordControl.value;
      return currentPassword === newPassword;
    }
    return false;
  }

  //Método que verifica que la contraseña actual no sea igual a la anterior
  verifyPassword(): boolean {
    const newPasswordControl = this.passwordForm.get('newPassword');
    const confirmPasswordControl = this.passwordForm.get('confirmPassword');

    if (newPasswordControl && confirmPasswordControl) {
      const newPassword = newPasswordControl.value;
      const confirmPassword = confirmPasswordControl.value;
      return newPassword === confirmPassword;
    }
    return false;
  }

  //Método que obtiene la nueva contraseña, para poder enviarla al body
  getNewPasswordToChange(): BodyChangePasswordInApp {
    let body: BodyChangePasswordInApp = {
      password: this.passwordForm.get('newPassword')?.value
    }
    return body;
  }

  //Método que consume el servicio que cambia la contraseña del usuario
  changePassword() {
    this.spinnerStatus = false;
    this.passwordService.changePassword(this.getHeaders(), this.getNewPasswordToChange()).subscribe({
      next: (response: any) => {
        this.spinnerStatus = true;
        this.showToastSuccess('La contraseña se cambió con éxito', 'Éxito');
        this.infoUser = JSON.parse(sessionStorage.getItem('infoUser') || '{}');
        if (this.infoUser.type_user == environment.STUDENT)
          this.router.navigateByUrl("/student/home/learn/modules");
        else
          this.router.navigateByUrl("/teacher/home/dashboard/options");
      },
      error: (error) => {
        this.spinnerStatus = true;
        this.showToastSuccess('La contraseña se cambió con éxito', 'Éxito');
        if (this.infoUser.type_user == environment.STUDENT)
          this.router.navigateByUrl("/student/home/learn/modules");
        else
          this.router.navigateByUrl("/teacher/home/dashboard/options");
      }
    });
  }

  //Método que muestra un toast con mensaje de ÉXITO
  showToastSuccess(message: string, title: string) {
    this.toastr.success(message, title, {
      progressBar: true,
      timeOut: 3000,
    });
  }

  //Método que muestra un toast con mensaje de ERROR
  showToastError(title: string, message: string) {
    this.toastr.error(message, title, {
      progressBar: true,
      timeOut: 3000,
    });
  }

  //Método que redirige al apartado del inicio (Cancelar)
  goToHome() {
    this.router.navigateByUrl("/teacher/home/dashboard/options");
  }

  togglePasswordVisibility(input: number) {
    if (input == 1)
      this.showPassword = !this.showPassword;
    else if (input == 2)
      this.showPassword2 = !this.showPassword2;
    else if (input == 3)
      this.showPassword3 = !this.showPassword3;
  }

  // Método para obtener el tipo de entrada de contraseña según la visibilidad
  getPasswordInputType(input: number) {
    switch (input) {
      case 1:
        return this.showPassword ? 'text' : 'password';
      case 2:
        return this.showPassword2 ? 'text' : 'password';
      default:
        return this.showPassword3 ? 'text' : 'password';
    }
  }

  //Icons to use
  iconPassword = iconos.faLock;
  iconInfoPolicies = iconos.faCircleInfo;
  iconViewPassword = iconos.faEye;
  iconHidePassword = iconos.faEyeSlash;
}
