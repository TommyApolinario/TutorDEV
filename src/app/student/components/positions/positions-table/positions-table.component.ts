import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import * as iconos from '@fortawesome/free-solid-svg-icons';
import { StatisticsService } from '../../../services/statistics.service';
import { ApiResponseGetTopTenI } from '../../../interfaces/statistics';
import { SpinnerComponent } from '../../../../shared-components/spinner/spinner.component';
import { ToastAlertsService } from '../../../../shared-components/services/toast-alerts.service';

@Component({
  selector: 'app-positions-table',
  standalone: true,
  imports: [
    FontAwesomeModule,
    SpinnerComponent
  ],
  providers: [
    StatisticsService
  ],
  templateUrl: './positions-table.component.html',
  styleUrl: './positions-table.component.css'
})
export class PositionsTableComponent {

  //Variables
  spinnerStatus: boolean = false;
  arrayTopTenUsers: ApiResponseGetTopTenI[] = [];
  currentDate: string = '';
  lastDate: string = '';

  //constructor
  constructor(
    private statisticsService: StatisticsService,
    private toastr: ToastAlertsService
  ) { }

  //ngOnInit
  ngOnInit() {
    this.getCurrentDate();
    this.getTopTenUsers();
  }

  //Método que obtiene los headers
  getHeaders() {
    let headers = new Map();
    headers.set("token", sessionStorage.getItem("token"));
    headers.set("typeUser", sessionStorage.getItem("typeUser"));
    return headers;
  }

  //Método que consume el servicio para obtener el top 10 de usuarios con más puntos
  getTopTenUsers() {
    this.spinnerStatus = false;
    this.statisticsService.getTopTenUsers(this.getHeaders(), this.lastDate, this.currentDate)
      .subscribe({
        next: (data: ApiResponseGetTopTenI[]) => {
          this.spinnerStatus = true;
          this.arrayTopTenUsers = data;
        },
        error: (error) => {
          this.spinnerStatus = true;
          this.toastr.showToastError("Error", "No se pudo obtener el top 10 de usuarios");
        }
      });
  }

  //Método que obtiene el rango de fechas
  getCurrentDate(): void {
    const today: Date = new Date();
    this.currentDate = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
    const lastMonthDate: Date = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    this.lastDate = `${lastMonthDate.getFullYear()}-${(lastMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${lastMonthDate.getDate().toString().padStart(2, '0')}`;
  }


  //Icons to use
  iconViewInfoProfile = iconos.faCircleChevronRight;
}
