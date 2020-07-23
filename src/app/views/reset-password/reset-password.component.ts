import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import {Router,ActivatedRoute} from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../helpers/auth.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  constructor( 
    private router:Router,
    private route: ActivatedRoute,

    private authService: AuthService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,


    ) { }
    
  resetPasswordForm: FormGroup;
  passSubmitted: Boolean = false;
  showError: string ='';
  token: string = '';
  ngOnInit(): void {
    this.showError = '';
    let PasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    this.token = this.route.snapshot.params.id;
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.pattern(PasswordPattern)],
      confirmPassword: ['', Validators.required],
    });

  }
  get passForm() { return this.resetPasswordForm.controls;}

  onResetPasswordSubmit(){
    this.showError = ''
    if(!this.token){
      this.showError ="Token Missing"
    }
    this.passSubmitted = true;
    
    if(this.resetPasswordForm.invalid){
      return false;
    }
    let values = this.resetPasswordForm.value;
    if(values.password !== values.confirmPassword){
      this.showError = "Confirm password Mismatch";
      return false;
    }

    this.authService.resetPassword({password: values.password, token: this.token}).subscribe((data) => {
      if(data){
        this.toastr.success('Success', 'Password Reset Email sent.');
        this.resetPasswordForm.reset();
        this.router.navigate(['/login']);
      }
    },
    error => {
      this.toastr.error('Error',error.message);
    });
  }

}
