import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slider-videos',
  standalone: true,
  imports: [
    FontAwesomeModule
  ],
  templateUrl: './slider-videos.component.html',
  styleUrl: './slider-videos.component.css'
})
export class SliderVideosComponent {

  //Vector de prueba
  @Input() carouselExample: string = "";
  
  @Input() location: string = "";
  @Input() videoTitle: string = "Videos"
  userRole: string = "--";

  arrayVideosDetail1: any[] = [
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132530/E_Suscribirse_nuevo_M%C3%B3dulo_yihmjb.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132530/E_Pr%C3%A1ctica_Nueva_mencjk.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132532/E_Visualizar_Info_M%C3%B3dulo_xlv77m.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132532/E_Visualizar_Top_10_aptj74.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
  ];

  arrayVideosDetail2: any[] = [
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132530/E_Modulo_de_clases_s55tay.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132531/E_Usar_Chat_con_IA_qjeddd.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132529/Actualizar_info_perfil_chlvjx.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
    {
      picture: "https://res.cloudinary.com/dfzyxagbc/image/upload/v1710132529/E_Actualizar_contrase%C3%B1a_bafkwq.png",
      title: "Video de prueba",
      url: "https://www.youtube.com",
      time: "1:08 minutos",
      descripcion: "Este es un video explicativo de prueba"
    },
  ];

  //Constructor
  constructor(
    private router: Router
  ) { }

  //ngOnInit
  ngOnInit() {
    this.userRole = sessionStorage.getItem("role")!;
  }

  //Método que redirige al componente de ver reproductor de video
  goToVideoDetail(video: any) {
  }

  redirectToYouTubePlaylist() {
    window.open('https://www.youtube.com/playlist?list=PLqYBsg7wChtYrGoweiae03Kw57pc0x7fu', '_blank');
  }

  /*Icons to use*/
  iconVideo = iconos.faVideo;
}
