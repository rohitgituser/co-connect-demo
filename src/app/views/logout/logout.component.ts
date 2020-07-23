import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../helpers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor( private authService: AuthService,   private route: ActivatedRoute, private router: Router,) { }

  ngOnInit(): void {
    this.authService.logout();
    this.router.navigate(['/login'])
    this.authService.logout();


  }

}
