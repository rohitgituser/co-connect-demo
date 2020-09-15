
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpClientModule} from '@angular/common/http';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ConstantService } from '../services/constant.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { handleError, getHeaders, checkIfNull } from '../utilities/common'


import * as CryptoJS from 'crypto-js';
import { UserRole } from '../enums/user-role';
// import * as bcrypt from 'bcryptjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

public crypto: any;
public serverUrl = "";
public authUrl = "";
public logoutUrl = "";

errorData: {};

public isLoggedIn = false;
public isAuthorise =false;

constructor(private http: HttpClient, private toastr: ToastrService,public ConstService:ConstantService,private router: Router) { 
  this.serverUrl = ConstService.loginUrl;
  this.authUrl =ConstService.authUrl;
  this.logoutUrl =ConstService.logoutUrl;
}

checkLogin() {
  const currentUser = this.getAuthUser();
  const appToken = this.getAppToken();

  if (currentUser && appToken) {
    return true;
  }

  this.router.navigate(['/login']);
}

restrctLogin() {
  const currentUser = this.getAuthUser();
  const appToken = this.getAppToken();

  if (currentUser && appToken) {
    currentUser['role'] === UserRole.BA ? this.router.navigate(['/userDashboard']) : this.router.navigate(['/dashboard']);
  }else{
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('appToken');
    this.isLoggedIn = false;
  }
}

redirectUrl: string;

login(username: string, password: string) {
    var newusername = username.substr(0, username.indexOf('@'));
    var usernameData =  this.encrypt(username);
    var encryptedData =  this.encryptPassword(password);

    var dataLogin = {   
      username: usernameData, 
      password: encryptedData
    };
    
    return this.http.post<any>(`${this.serverUrl}/login`, dataLogin)
      .pipe(map(user => {
        if (user && user.status =='success') {
          sessionStorage.setItem('currentUser', JSON.stringify(user.data));
          this.isLoggedIn = true;
        }
        if (user && user.status =='error') {
          this.toastr.error('',user.message);
          return false;
        }
      })
    );
}

forgot(postBody) {

  
  return this.http.post<any>(`${this.serverUrl}/forgot`, postBody)
    .pipe(map(user => {
      if (user && user.status =='success') {
        sessionStorage.setItem('currentUser', JSON.stringify(user.data));
        this.isLoggedIn = true;
      }
      if (user && user.status =='error') {
        this.toastr.error('',user.message);
        return false;
      }
    })
  );
}

resetPassword(postBody) {

  
  return this.http.post<any>(`${this.serverUrl}/resetPassword`, postBody)
    .pipe(map(user => {
      if (user && user.status =='success') {
        return true;
      }
      if (user && user.status =='error') {
        this.toastr.error('',user.message);
        return false;
      }
    })
  );
}


ValidateToken() {
    var token = this.getAuthorizationToken();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
        'authToken':currentUser.authToken,
        'userId':currentUser.userId,
        'deviceType': currentUser.deviceType,
      })
    };
    
    var authData ={
      'userId':currentUser.userId,
      'authToken':currentUser.authToken,
      'appid':currentUser.appid,
      'deviceType':currentUser.deviceType
    }

    return this.http.post(this.authUrl, authData, httpOptions)
      .pipe(map(authData => {
        if(authData){
          this.isAuthorise=true;
          sessionStorage.setItem('appToken', JSON.stringify(authData));
        }
      })
    );
}

  encryptPassword(text) {
    try {
        let secret = '$Ad,1sO>Mr=j1?b*H.jz$XMLiR+QyIzd?)w&Yy]KG/wr<:gGoxTR0TlI`C.f-<t'
        return CryptoJS.HmacSHA512(text, secret).toString();
        
      } catch (error) {
        
      }
  }

  encrypt(text) {
    try {
        const key = 'S5e8dO8ayjjDmatUBxPScsZqXBdkk7yk'
        const iv =  CryptoJS.lib.WordArray.random(128 / 8);
        let encrypted = CryptoJS.AES.encrypt(
          text, key, {
            keySize: 16,
            iv: iv,
        });
        let v = { iv: iv.toString(), encryptedData: encrypted.toString() }
        return v;
      } catch (error) {
        console.log('error - ', error)
      }
  }

  decrypt(data) {
    const key = 'S5e8dO8ayjjDmatUBxPScsZqXBdkk7yk';
    let decrypted = CryptoJS.AES.decrypt(
      data.encryptedData, key, {
        keySize: 16,
        iv: data.iv,
      }).toString(CryptoJS.enc.Utf8);
  }

  getAuthorizationToken() {
    const currentUser = sessionStorage.getItem('currentUser');
    if(currentUser){
      this.isLoggedIn = true;
      this.isAuthorise = true;

      var user =JSON.parse(currentUser);
      return user.token;
    }else{
      return false;
    }
  }

  getAuthUser(){
    const currentUser = sessionStorage.getItem('currentUser');
    if(currentUser){
      return JSON.parse(currentUser);
    }else{
      return false;
    }
  }

  getAppToken(){
    const appToken = sessionStorage.getItem('appToken');
    if(appToken){
      let tokenData= JSON.parse(appToken)
      return tokenData.data;
    }else{
      return false;
    }
  }

  logout() {
   
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    var authData ={
      'userId':currentUser._id,
      'token':currentUser.token,
      'email': currentUser.email
      // 'appid':currentUser.appid,
      // 'deviceType':currentUser.deviceType
    }

    this.http.post(this.logoutUrl,authData, getHeaders('application/json')).subscribe(authData => {
      if(authData){
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('appToken');
        
        this.isLoggedIn = false;
        this.isAuthorise = false;
        this.router.navigate(['/login']);
      }
    }),
    catchError(this.handleError)
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {

      // A client-side or network error occurred. Handle it accordingly.
      this.toastr.error('Error',error.error.message);

      console.error('An error occurred:','Invalid Credentials');
    } 

    // return an observable with a user-facing error message
    // this.toastr.error('Error','Bad request');

    this.errorData = {
      errorTitle: 'Oops! Request for document failed',
      errorDesc: 'Something bad happened. Please try again later.'
    };
    return throwError(this.errorData);
  }

  register(data){

    data.role = "user";

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    

    return this.http.post<any>(`${this.serverUrl}/register`, data)
      .pipe(map(user => {
        if(user.status == "error") {
          this.toastr.error('Error',user.message);
          return false;
        }
        if(user.status =="success"){
          return data;
        }
        
      })
      );


  }

  reRegister(data){

    data.role = "user";

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    

    return this.http.post<any>(`${this.serverUrl}/reRegister`, data)
      .pipe(map(user => {
        if(user.status == "error") {
          this.toastr.error('Error',user.message);
          return false;
        }
        if(user.status =="success"){
          return data;
        }
        
      })
      );


  }

  registerCHA(data){

    data.role = "agent";

    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
      })
    };
    

    return this.http.post<any>(`${this.serverUrl}/register`, data)
      .pipe(map(user => {
        if(user.status == "error") {
          this.toastr.error('Error',user.message);
          return false;
        }
        if(user.status =="success"){
          return data;
        }
        
      })
      );


  }

  getUserById = (userId: string) => {
    const httpOptions = {
      headers: new HttpHeaders({ 
        'Content-Type': 'application/x-www-form-urlencoded',
        // 'authToken':currentUser.authToken,
        'userId':userId,
      })
    };
    let url = '/getUserById/' +  userId;
   
    console.log('url', url)
    return this.http.get(this.serverUrl + url )
  }
}
