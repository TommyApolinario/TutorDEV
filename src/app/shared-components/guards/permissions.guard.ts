import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PermissionsGuard implements CanActivate {
  /*Constructor*/
  constructor(private router: Router) { }

  /*Activa la protección de la ruta verificando si existe un usuario logueado o no*/
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Verificar si existe un token en el sessionStorage
    const token = sessionStorage.getItem('token');
    if (token) {
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
