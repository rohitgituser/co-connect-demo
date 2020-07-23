import {Component} from '@angular/core';
import { navItems } from '../../_nav';
import { navItems1 } from '../../_.nav2';
import { UserRole } from '../../enums/user-role';
import { ConditionalExpr } from '@angular/compiler';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent {
  user: object; 
  public sidebarMinimized = false;
  public currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  public navItems = this.currentUser ? (this.currentUser['role'] == UserRole.ICC_ADMIN ||this.currentUser['role'] == UserRole.ICC_EDITOR )  ?  navItems: navItems1 : navItems1 ;

  ngOnInit(): void {

  }
  getCurrentUserName(){
    if(this.currentUser && this.currentUser.firstName && this.currentUser.lastName){
      return this.currentUser.firstName + ' ' + this.currentUser.lastName;

    }else{
      return this.currentUser.companyName;

    }
     
  }
 
  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }
}
