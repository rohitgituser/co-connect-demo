import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators'
import { handleError, getHeaders, checkIfNull, getHeadersWithNoContentType } from '../utilities/common'
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class MastersService {

  public serverUrl = "";

  constructor(private http: HttpClient, public ConstService:ConstantService) {
    this.serverUrl = ConstService.serverUrl;
   }

  getAllUsersList = (name,type, page) => {
    let url ='users?';
    url = url + '&role=' + 'user'
    if(name) {  url = url + '&name=' + name}
    if(type) {  url = url + '&type=' + type;}
    if(page)  {  url = url + '&page=' + page;} else{url = url + '&page=' + '1'; }
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  getAllAgentsList = (name,type, page) => {
    let url ='users?';
    url = url + '&role=' + 'agent'
    if(name) {  url = url + '&name=' + name}
    if(type) {  url = url + '&type=' + type;}
    if(page)  {  url = url + '&page=' + page;} else{url = url + '&page=' + '1'; }
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  getAllAgentsExportersList = (id) => {
    let url ='users/cha/exportersList/' + id;
    // if(id) {  url = url + '&chaId=' + id;}
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

  getExportersAgentsList = (exporterId, name, page)=> {
    let url ='users/exportersCHAList/?';
    url = url + '&role=' + 'agent';
    if(exporterId) {  url = url + '&exporterId=' + exporterId}
    if(name) {  url = url + '&name=' + name}
    if(page)  {  url = url + '&page=' + page;} else{url = url + '&page=' + '1'; }
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  findNewCHAByName = (name) => {
    let url ='users/exportersFindCHA/?';
    url = url + '&role=' + 'agent';
    if(name) {  url = url + '&name=' + name}
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  findNewCHAByEmail= (email) => {
    let url ='users/exportersFindCHA/?';
    url = url + '&role=' + 'agent';
    if(email) {  url = url + '&email=' + email}
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  inviteCHAByExporter =(user) => {
    let url ='users/inviteCHA/';
    return this.http.post(this.serverUrl + url,user, getHeaders('application/json'))

  }
  removeCHAByExporter=(user) => {
    let url ='users/removeCHA/';
    return this.http.post(this.serverUrl + url,user, getHeaders('application/json'))

  }

  inviteNewCHA=(email) => {
    let url ='users/inviteNewCHA';
    return this.http.post(this.serverUrl + url,{email:email}, getHeaders('application/json'))

  }
  getMembersList =  (name,type, page) => {
    let url ='masters/members?';
    if(name) {  url = url + '&name=' + name}
    if(type) {  url = url + '&type=' + type;}
    if(page)  {  url = url + '&page=' + page;} else{url = url + '&page=' + '1'; }
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  uploadMembersCSV = (formData: FormData) => {
    let url ='masters/uploadCSV/members';
    return this.http.post(this.serverUrl + url, formData, getHeadersWithNoContentType()).pipe(catchError(handleError))
  }
  
  getAllUsersListNoPagination = (name,location) => {
    let url ='users/noPagination/list?';
    if(name) {  url = url + '&name=' + name}
    if(location) {  url = url + '&location=' + location;}
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  getAllLocationList = () => {
    return this.http.get(this.serverUrl + 'masters/locations/', getHeaders('application/json'))
  }

  getAllLocationByCity = (city) => {
    let url = 'masters/locations?';
    if(city) {  url = url + '&city=' + city;}
    return this.http.get(this.serverUrl + url, getHeaders('application/json')).pipe(catchError(handleError))

  }

  getBaUsers = (name: string) => {
    let url ='users/baSelect?';
    if(name) {  url = url + '&name=' + name}
    url = url + '&onlyBA=true';
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }

  getBaAndChaUsers = (name: string) => {
    let url ='users/baSelect?';
    if(name) {  url = url + '&name=' + name}
    url = url + '&baAndCHA=true';
    return this.http.get(this.serverUrl + url, getHeaders('application/json'))
  }


  // getAllLists =  (name: string, page:any) => {
  //   let url = 'masters/lists?';
  //   if(name) {  url = url + '&name=' + name;}
  //   if(page) {  url = url + '&page=' + page;}
  //   return this.http.get(this.serverUrl + url , getHeaders('application/json'))
  // }

  createList = (body) => {
    return this.http.post(this.serverUrl + 'masters/lists/', body, getHeaders('application/json'))

  }

  updateList = (listId, body) => {
    return this.http.put(this.serverUrl + 'masters/lists/' + listId, body, getHeaders('application/json'))

  } 
  addUsersToList = (listId, body) => {
    return this.http.post(this.serverUrl + 'masters/lists/addUsers/' + listId, body, getHeaders('application/json'))

  } 
  activateUserRequest = (activateDetails) => {
    return this.http.post(this.serverUrl + 'users/activateUser' , activateDetails , getHeaders('application/json'))
  }

  deActivateUserRequest = (userId) => {
    return this.http.post(this.serverUrl + 'users/deActivateUser' , {_id:userId} , getHeaders('application/json'))
  }

  saveUserDetails = (user) => {
    return this.http.post(this.serverUrl + 'users/saveDetails/' + user._id , user , getHeaders('application/json'))
 
  }

  rejectRegistrationRequest = (body) => {
    return this.http.post(this.serverUrl + 'auth/rejectRegistration' ,  body, getHeaders('application/json'))
  }

  getPricingList =(name:string, page:any) => {

    let url = 'masters/costs?';
    if(name) {  url = url + '&name=' + name;}
    if(page) {  url = url + '&page=' + page;}

    return this.http.get(this.serverUrl + url , getHeaders('application/json'))

  }

  updatePricing=(cost) => {

    let url = 'masters/costs/' + cost._id;
  
    return this.http.post(this.serverUrl + url , cost,  getHeaders('application/json'))

  }


  getAllPricing = () => {
    let url = 'masters/costs/allcosts';

    return this.http.get(this.serverUrl + url , getHeaders('application/json'))

  }

  getConfig = (name: string) => {
    let url = 'masters/configs?';
    if(name) {  url = url + '&name=' + name;}
    return this.http.get(this.serverUrl + url , getHeaders('application/json'))

  }

  getAllExportersForCHA = () =>{
    let url = 'users/getAllExportersForCHA';

    return this.http.get(this.serverUrl + url , getHeaders('application/json'))

  }

 }
