import { Component } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../helpers/auth.service';
import { UserRole } from '../../enums/user-role';
import { LoadingScreenService } from '../loader/services/loading-screen.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  imagesUrl: object; 
  loginForm: FormGroup;
  registrationForm: FormGroup;
  forgotPasswordForm: FormGroup;
  submitted = false;
  registerSubmitted = false;
  passSubmitted = false;
  error: {};
  loginError: string;
  // passwordConfirm: string = '';
  showError: String ='';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService,
    private loadingService: LoadingScreenService
    ) {  }
  ngOnInit() {
    this.imagesUrl = ['assets/img/brand/ad1.png', 'assets/img/brand/ad2.jpg', 'assets/img/brand/ad3.jpg'];
    this.authService.restrctLogin();
    let EmailPattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
    let PasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    let panPattern = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}")
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.pattern(EmailPattern)],
      password: ['', Validators.required]
    });

    this.forgotPasswordForm = this.formBuilder.group({
      email: ['', Validators.pattern(EmailPattern)],
    });

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
      coReferenceDate: ['', Validators.required],
      password:['', Validators.pattern(PasswordPattern)],
      passwordConfirm: [''],

    })
  }

  // setUser(): void {
  //   localStorage.setItem('user', JSON.stringify({name: "Prateek Sharma ", email: 'pratik.sharma1619@gmail.com ', role: 1}));

  // }
  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  get rForm() { return this.registrationForm.controls;}
  get passForm() { return this.forgotPasswordForm.controls;}

  onSubmit() {
    this.submitted = true;

    this.loadingService.show()
    this.authService.login(this.username.value, this.password.value).subscribe((data) => {
       this.loadingService.hide()
       if (this.authService.isLoggedIn) {
        //  this.authService.ValidateToken().subscribe((authData) => {
            let returnUrl =  JSON.parse(sessionStorage.getItem('currentUser'))['role'] === UserRole.ICC_ADMIN || JSON.parse(sessionStorage.getItem('currentUser'))['role'] === UserRole.ICC_EDITOR  ? '/dashboard': '/userDashboard'
            this.router.navigate([returnUrl]);
            this.toastr.success('Success', 'Login success');
        //  });
        } 
      },
      error => {
        this.loadingService.hide()
        this.error = error
        this.toastr.error('Error',error.message);
        this.loginError = error.message;
      }
    );
  }

  onForgotPasswordSubmit () {
    this.passSubmitted = true;
    this.loadingService.show();
    if(this.forgotPasswordForm.invalid){
      return false;
    }
    let values = this.forgotPasswordForm.value
    this.authService.forgot({username: values.email}).subscribe((data) => {
      
           this.toastr.success('Success', 'Password Reset Email sent.');
           this.forgotPasswordForm.reset();
            document.getElementById('closeForgotPasswordModalButton').click()
     },
     error => {
       this.loadingService.hide()
       this.error = error
       this.toastr.error('Error',error.message);
       this.loginError = error.message;
     }
   );

  }
  onRegisterSubmit() {
    this.showError = ''
    this.registerSubmitted = true;
    this.loadingService.show();
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

    this.authService.register(values).subscribe((data) => {
      if(data && data['email'] ){
        this.loadingService.hide();

        document.getElementById("closeRegistrationModalButton").click();
        this.registrationForm.reset();
        this.registerSubmitted = false;
        this.toastr.success('Success', 'Registration success');
      }
      


    });
  }

}