import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastAlertsService {

  constructor(private toastr: ToastrService) { }

  // Método que muestra un toast con mensaje de ÉXITO
  showToastSuccess(message: string, title: string) {
    this.toastr.success(message, title, {
      progressBar: true,
      timeOut: 3000,
    });
  }

  // Método que muestra un toast con mensaje de ERROR
  showToastError(title: string, message: string) {
    this.toastr.error(message, title, {
      progressBar: true,
      timeOut: 3000,
    });
  }

  // Método que muestra un toast con mensaje de INFORMACIÓN
  showToastInformation(title: string, message: string) {
    this.toastr.info(message, title, {
      progressBar: true,
      timeOut: 3000,
    });
  }
}
