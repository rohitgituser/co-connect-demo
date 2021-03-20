import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConstantService {

  public serverUrl:string;
  public loginUrl :string;
  public authUrl :string;
  public logoutUrl :string;

  constructor() {
    // this.serverUrl = 'http://localhost:4000/api/v1/';
    // this.loginUrl = 'http://localhost:4000/api/v1/auth';
    // this.authUrl = 'http://localhost:4000/api/v1/auth';
    // this.logoutUrl = 'http://localhost:4000/api/v1/auth/logout';


    //Demo Server
    this.serverUrl = 'https://api.dcciapune.com/api/v1/';
    this.loginUrl = 'https://api.dcciapune.com/api/v1/auth';
    this.authUrl = 'https://api.dcciapune.com/api/v1/auth';
    this.logoutUrl = 'https://api.dcciapune.com/api/v1/auth/logout';
   }

   getUrl(){
     return this.serverUrl;
   }

}
