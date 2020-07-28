import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MastersService } from '../../services/masters.service';
import { ToastrService } from 'ngx-toastr';

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
    private mastersService: MastersService,
    private toastr: ToastrService,

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
      contactPersonName: [this.currentUser['contactPersonName'], Validators.required],
      // contactPersonName: [this.currentUser['contactPersonName'], Validators.required],
      contactNumber: [this.currentUser['contactNumber'], Validators.required],
      faxNumber: [this.currentUser['faxNumber'], Validators.required],
      website: [this.currentUser['website']],
      coReference: [this.currentUser['coReference']],

    })
  }

  get rForm() { return this.registrationForm.controls;}

  onRegisterSubmit(){
    this.registerSubmitted = true;
    this.showError = ''
    if(this.registrationForm.invalid){
      console.log(this.registrationForm);
      return false;
    }
    let values = this.registrationForm.value;
    console.log('values', values);
    values._id = this.currentUser['_id'];
    this.mastersService.saveUserDetails(values).subscribe(data => {
      console.log(data);
      if(data['status'] == "success"){
        this.currentUser = data['data'];
        sessionStorage.setItem('currentUser', JSON.stringify(data['data']));
        // this.getUsersList('', '', '1');
        this.toastr.success('Success', 'Profile Updated.');

      }

      // document.getElementById("closeViewUserModalButton").click();
    });

  }
}
