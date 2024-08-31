import { Component } from "@angular/core";
import Swal from "sweetalert2";

@Component({
    selector: 'confirm-alerts',
    standalone: true,
    template: '',
    styles: []
})

export class SweetAlertsConfirm {

    /*Alerta que muestra botones de aceptar o cancelar con icono de PREGUNTA*/
    alertConfirmCancelQuestion(title: string, message: string): Promise<any> {
        const result = Swal.fire({
            title: title,
            text: message,
            icon: 'question',
            iconColor: '#5952A2',
            showCancelButton: true,
            confirmButtonColor: '#5952A2 !important',
            cancelButtonColor: '#FC3B56',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Aceptar'
        })
        return result
    }

    /*Alerta que muestra botones de aceptar o cancela con icono de INFORMACIÓN*/
    alertConfirmCancelInformation(title: string, message: string): Promise<any> {
        const result = Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            iconColor: '#5952A2',
            showCancelButton: true,
            confirmButtonColor: '#5952A2 !important',
            cancelButtonColor: '#FC3B56',
            cancelButtonText: 'Cancelar',
            confirmButtonText: 'Suscribirme'
        })
        return result
    }
}