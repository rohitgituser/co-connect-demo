import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../helpers/auth.service';
// import { LoadingScreenService } from '../../loader/services/loading-screen.service';
@Component({
  selector: 'app-update-rejestration',
  templateUrl: './update-rejestration.component.html',
  styleUrls: ['./update-rejestration.component.css']
})
export class UpdateRejestrationComponent implements OnInit {
  registrationForm: FormGroup;
  registerSubmitted = false;
  showError: String ='';
  userId: string ='';
  selectedUser: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,

    // private loadingService: LoadingScreenService
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params.id;

    this.getUser(this.userId);
    let EmailPattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
    let PasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    let panPattern = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")
    this.registrationForm = this.formBuilder.group({
      email: ['', Validators.pattern(EmailPattern)],
      companyName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
      iecNumber: ['', Validators.required],
      gstinNumber: [''],
      panNumber: ['', Validators.pattern(panPattern)],
      // cdDmName: ['', Validators.required],
      contactPersonName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      faxNumber: [''],
      // turnover: ['', Validators.required],
      // product: ['', Validators.required],
      website: [''],
      coReference: ['', Validators.required],
      coReferenceDate:  ['' , Validators.required],

      password:['', Validators.pattern(PasswordPattern)],
      passwordConfirm: [''],

    })
  }

  get rForm() { return this.registrationForm.controls;}

  getUser(userId){
    let EmailPattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
    let panPattern = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}");
    let PasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");

    this.authService.getUserById(userId).subscribe(data => {
      if(data['status']  == "success"){
        console.log(data);
        this.selectedUser = data['data'];
        this.registrationForm = this.formBuilder.group({
          email: [this.selectedUser.email ],
          companyName: [this.selectedUser.companyName, Validators.required],
          address: [this.selectedUser.address, Validators.required],
          city: [this.selectedUser.city, Validators.required],
          state: [this.selectedUser.state, Validators.required],
          zipCode: [this.selectedUser.zipCode, Validators.required],
          iecNumber: [this.selectedUser.iecNumber, Validators.required],
          gstinNumber: [this.selectedUser.gstinNumber],
          panNumber: [this.selectedUser.panNumber, Validators.pattern(panPattern)],
          // cdDmName: ['', Validators.required],
          contactPersonName: [this.selectedUser.contactPersonName, Validators.required],
          contactNumber: [this.selectedUser.contactNumber, Validators.required],
          faxNumber: [this.selectedUser.faxNumber],
          // turnover: ['', Validators.required],
          // product: ['', Validators.required],
          website: [this.selectedUser.website],
          coReference: [this.selectedUser.coReference , Validators.required],
          coReferenceDate:  [this.selectedUser.coReferenceDate , Validators.required],
          password:['', Validators.pattern(PasswordPattern)],
          passwordConfirm: [''],
    
        })
      }
    })
  }

  onRegisterSubmit() {
    this.showError = ''
   
    this.registerSubmitted = true;
    // this.loadingService.show();
    console.log('this.registrationForm', this.registrationForm)

    if(this.registrationForm.invalid){
      return false;
    }

    
    let values = this.registrationForm.value;
    console.log('values.password', values.password);
    console.log(values.passwordConfirm != values.password);
    console.log('passwordConfirm', values.passwordConfirm)
    if(values.passwordConfirm !== values.password){
      this.showError = "Confirm Password is not matching."
      return false;
      
    }
    values.userId = this.userId;
    this.authService.reRegister(values).subscribe((data) => {
      if(data && data['email'] ){
        // this.loadingService.hide();

        // document.getElementById("closeRegistrationModalButton").click();
        this.registrationForm.reset();
        this.registerSubmitted = false;

        this.toastr.success('Success', 'Registration success');
        this.router.navigate(['/login']);

      }
      


    });
  }

}
