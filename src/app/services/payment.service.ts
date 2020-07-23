import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators'
import { handleError, getHeaders, checkIfNull, getHeadersWithNoContentType } from '../utilities/common'
import { ConstantService } from './constant.service';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  public serverUrl = "";

  constructor(private http: HttpClient, public ConstService:ConstantService) { 
    this.serverUrl = ConstService.serverUrl;

  }

  getPayments= ( companyName, startDate, endDate, page) =>{
    let url = 'payment?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

  getEditorPayments = ( companyName, startDate, endDate, page) => {
    let url = 'editorPayment?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

}
