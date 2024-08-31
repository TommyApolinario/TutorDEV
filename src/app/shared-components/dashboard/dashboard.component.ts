import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardI } from '../interfaces/dashboard';
import { environment } from '../../../environments/environment';
import { UserLoginI } from '../../auth/interfaces/login';
import { SpinnerComponent } from '../spinner/spinner.component';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { ApiResponseGetInfoUserI } from '../interfaces/user-profile';
import { UserProfileService } from '../services/user-profile.service';
import { ToastAlertsService } from '../services/toast-alerts.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    SpinnerComponent
  ],
  providers: [
    UserProfileService
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  //Variables
  optionsMenu: DashboardI[] = [];
  userInformation: ApiResponseGetInfoUserI = {} as ApiResponseGetInfoUserI;
  spinnerStatus: boolean = false;
  typeUser: string = '';

  //constructor
  constructor(
    private router: Router,
    private routerActivated: ActivatedRoute,
    private toastr: ToastAlertsService,
    private userProfileService: UserProfileService
  ) { }

  //ngOnInit()
  ngOnInit() {
    this.spinnerStatus = true;
    this.typeUser = sessionStorage.getItem("typeUser") || "student";
    this.getInfoUser();

    if (this.typeUser == environment.STUDENT) {
      this.router.navigate(['learn/modules'], { relativeTo: this.routerActivated })
      this.optionsMenu.push({ icon: this.iconPositions, optionName: 'Posiciones', link: 'positions/positions-table', status: true });
      this.optionsMenu.push({ icon: this.iconMyClass, optionName: 'Mis clases', link: 'classes/my-class', status: true });
      this.optionsMenu.push({ icon: this.iconChatIA, optionName: 'Chat IA', link: 'chat-ia', status: true });
      this.optionsMenu.push({ icon: this.iconHelp, optionName: 'Ayuda', link: 'help/list-videos-help', status: true });
      //this.optionsMenu.push({icon: this.iconInformation, optionName: 'Información', link: 'information', status: true});
    }
    else if (this.typeUser == environment.TEACHER) {
      this.router.navigate(['dashboard/options'], { relativeTo: this.routerActivated })
      this.optionsMenu.push({ icon: this.iconModules, optionName: 'Módulos', link: 'modules/list-modules', status: true });
      this.optionsMenu.push({ icon: this.iconActivities, optionName: 'Actividades', link: 'activities/list-activities', status: true });
      //this.optionsMenu.push({ icon: this.iconMyClass, optionName: 'Mis clases', link: 'classes/list-classes', status: true });
      //this.optionsMenu.push({ icon: this.iconHelp, optionName: 'Ayuda', link: 'help/list-videos-help', status: true });
      //this.optionsMenu.push({icon: this.iconInformation, optionName: 'Información', link: 'information', status: true});
    }
    else {
      this.router.navigate(['dashboard/options'], { relativeTo: this.routerActivated })
      this.optionsMenu.push({ icon: this.iconUsers, optionName: 'Usuarios', link: 'users/list-users', status: true });
      //this.optionsMenu.push({ icon: this.iconHelp, optionName: 'Ayuda', link: 'help/list-videos-help', status: true });
      //this.optionsMenu.push({icon: this.iconInformation, optionName: 'Información', link: 'information', status: true});
    }
    this.showHideMenuProfile();
    this.showHideSidebar();
    this.detectedScreen();
    this.optionSelectedOnMenu();
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
        this.userInformation = data;
      },
      error: (error) => {
        this.spinnerStatus = true;
        this.toastr.showToastError("Error", "Ocurrió un error al obtener la información del usuario");
      }
    })
  }

  // Método que muestra y oculta el menú de la foto de perfil
  showHideMenuProfile() {
    const profile = document.querySelector<HTMLDivElement>('nav .profile');
    const imgProfile = profile?.querySelector<HTMLImageElement>('p');
    const dropdownProfile = profile?.querySelector<HTMLDivElement>('.profile-link');
    imgProfile?.addEventListener('click', function () {
      dropdownProfile?.classList.toggle('show');
    });
    window.addEventListener('click', function (e: MouseEvent) {
      if (e.target !== imgProfile) {
        if (e.target !== dropdownProfile) {
          if (dropdownProfile && dropdownProfile.classList.contains('show')) {
            dropdownProfile.classList.remove('show');
          }
        }
      }
    });
  }

  // Método que muestra y oculta el manú lateral del dashboard
  showHideSidebar() {
    const toggleSidebar = document.querySelector('nav .toggle-sidebar') as HTMLElement;
    const sidebar = document.getElementById('sidebar') as HTMLElement;
    const allSidebar = document.querySelectorAll<HTMLDivElement>('#sidebar .divider');

    if (sidebar.classList.contains('hide')) {
      allSidebar.forEach((item: HTMLDivElement) => {
        item.textContent = '-';
      });
    }
    else {
      allSidebar.forEach((item: HTMLDivElement) => {
        item.textContent = '-';
      });
    }
    toggleSidebar.addEventListener('click', function () {
      sidebar.classList.toggle('hide');
    });
  }

  // Método que detecta el tamaño de la pantalla, para ocultar automáticamente el menú lateral
  detectedScreen() {
    window.addEventListener('resize', function () {
      const sidebar = document.getElementById('sidebar') as HTMLElement;
      const isMobile = window.innerWidth <= 767;
      if (isMobile) {
        sidebar?.classList.add('hide');
      } else {
        sidebar?.classList.remove('hide');
      }
    });
  }

  // Método que agrega o elimina la clase "active" de una opción del menú
  optionSelectedOnMenu() {
    const menuItems = document.querySelectorAll('.side-menu li');
    menuItems.forEach((menuItem) => {
      const link = menuItem.querySelector('a') as HTMLElement;
      link.addEventListener('click', (event) => {
        event.preventDefault();
        menuItems.forEach((item) => {
          item.querySelector('a')?.classList.remove('active');
        });
        link.classList.add('active');
      });
    });
  }

  //Método que cierra la sesión del usuario
  signOut() {
    this.spinnerStatus = false;
    sessionStorage.removeItem("infoUser");
    sessionStorage.removeItem("typeUser");
    sessionStorage.removeItem("token");
    setTimeout(() => {
      this.spinnerStatus = true;
      this.router.navigateByUrl('auth/login');
    }, 2000);
  }

  //Método que redirige al usuario al inicio según el perfil
  goToHome() {
    if (this.typeUser == environment.STUDENT)
      this.router.navigateByUrl('student/home/learn/modules');
    else if (this.typeUser == environment.TEACHER)
      this.router.navigateByUrl('teacher/home/dashboard/options');
    else
      this.router.navigateByUrl('admin/home/dashboard/options');
  }

  //Icons to use
  iconBars = iconos.faBars;

  //ESTUDIANTE: iconos de las opciones del menú
  iconLearn = iconos.faHome;
  iconInformation = iconos.faInfoCircle;
  iconHelp = iconos.faQuestionCircle;
  iconArrowDown = iconos.faChevronDown;
  iconPractice = iconos.faFileLines;
  iconPositions = iconos.faUsers;
  iconMyClass = iconos.faChalkboardTeacher;
  iconChatIA = iconos.faComments;

  //PROFESOR: iconos de las opciones del menú
  iconHome = iconos.faHome;
  iconModules = iconos.faCubes;
  iconActivities = iconos.faIcons;

  //ADMINISTRADOR: iconos de las opciones del menú
  iconUsers = iconos.faUsers;

  //OPCIONES PERFIL: iconos de las opciones del menú en la foto de perfil
  iconProfile = iconos.faUserCircle;
  iconPassword = iconos.faLock;
  iconLogOut = iconos.faArrowRightFromBracket;
}
