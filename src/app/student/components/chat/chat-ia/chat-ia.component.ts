import { CommonModule } from '@angular/common';
import { ChatIaService } from '../../../services/chat-ia.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BodyChatIAI } from '../../../interfaces/chat-ia';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat-ia',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule
  ],
  providers: [ChatIaService],
  templateUrl: './chat-ia.component.html',
  styleUrl: './chat-ia.component.css'
})
export class ChatIaComponent {

  //Variables
  inputForm!: FormGroup;
  arrayMessages: { sender: string, content: string }[] = [];
  spinnerStatus: boolean = false;
  urlUserProfileImg: string = "";
  responseMessageIA: string = "";
  userMessage: string = "";

  //Constructor
  constructor(
    private chatIAService: ChatIaService,
    private formBuilder: FormBuilder,
    private toastr: ToastAlertsService

  ) { }

  //ngOnInit
  ngOnInit() {
    this.createInputForm();
    const infoUserJson = sessionStorage.getItem("infoUser");
    if (infoUserJson) {
      const infoUser = JSON.parse(infoUserJson);
      this.urlUserProfileImg = infoUser.url_avatar;
    } else {
      this.urlUserProfileImg = "../../../../../assets/user-profile.png";
    }
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que crea el formulario
  createInputForm() {
    this.inputForm = this.formBuilder.group({
      request: [''],
    });
  }

  //Método que consume el servicio para enviar el mensaje y obtener la respuesta de la AI
  sendMessage() {
    this.spinnerStatus = true;
    this.userMessage = this.inputForm.value.request;

    this.arrayMessages.push({ sender: 'user', content: this.userMessage });
    let body: BodyChatIAI = {
      request: this.userMessage
    };
    this.arrayMessages.push({ sender: 'IA', content: "Escribiendo" });

    this.chatIAService.getChatResponse(this.getHeaders(), body)
      .subscribe({
        next: (data) => {
          this.arrayMessages.pop();
          this.responseMessageIA = data.response;
          // Agrega la respuesta de la IA al array de mensajes
          this.arrayMessages.push({ sender: 'IA', content: this.responseMessageIA });
          this.spinnerStatus = false;
        },
        error: (error) => {
          this.toastr.showToastError("Error", "La IA no ha podido procesar su mensaje");
          this.spinnerStatus = false;
        }
      });
    this.inputForm.reset();
  }


  //Icons to use
  iconSend = iconos.faPaperPlane;
  iconChatIA = iconos.faComments;
}
