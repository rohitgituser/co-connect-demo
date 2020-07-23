
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivateChild } from '@angular/router';
import { AuthService } from '../helpers/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean {
    return this.checkForAccess(route, state)
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.canActivate(route, state);
  }

  checkForAccess = (route: ActivatedRouteSnapshot,state: RouterStateSnapshot): boolean => {
    const currentUser = this.authService.getAuthUser()
    const appToken = this.authService.getAppToken()

    if(currentUser){

      //check if route is restricted by role
      if(route.data && route.data.roles && route.data.roles.indexOf(currentUser.role) === -1){
        //role not authorized so redirect to 401
        this.router.navigate(['/401'])
        return false
      }

      //authorized so return true
      return true
    }

    //not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}})
    return false
  }

}
