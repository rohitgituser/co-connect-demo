import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {


  currentUser:Object;
  registrationForm: FormGroup;
  registerSubmitted: Boolean =false;
  showError: String ='';

  constructor( 
    private formBuilder: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log('this.currentUser', this.currentUser);
    this.registrationForm = this.formBuilder.group({
      email: [this.currentUser['email']],
      companyName: [this.currentUser['companyName'], Validators.required],
      address: [this.currentUser['address'], Validators.required],
      iecNumber: [this.currentUser['iecNumber'], Validators.required],
      gstinNumber: [this.currentUser['gstinNumber'], Validators.required],
      panNumber: [this.currentUser['panNumber']],
      cdDmName: [this.currentUser['cdDmName'], Validators.required],
      contactPersonName: [this.currentUser['contactPersonName'], Validators.required],
      contactNumber: [this.currentUser['contactNumber'], Validators.required],
      faxNumber: [this.currentUser['faxNumber'], Validators.required],
      turnover: [this.currentUser['turnover'], Validators.required],
      product: [this.currentUser['product'], Validators.required],
      website: [this.currentUser['website']],
      memberId: [this.currentUser['memberId']],

    })
  }

  get rForm() { return this.registrationForm.controls;}

  onRegisterSubmit(){
    this.registerSubmitted = true;
    this.showError = ''
    if(this.registrationForm.invalid){
      return false;
    }
  }
}
