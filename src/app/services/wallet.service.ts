import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators'
import { handleError, getHeaders, checkIfNull, getHeadersWithNoContentType } from '../utilities/common'
import { ConstantService } from './constant.service';
@Injectable({
  providedIn: 'root'
})
export class WalletService {

  public serverUrl = "";

  constructor(private http: HttpClient, public ConstService:ConstantService) { 
    this.serverUrl = ConstService.serverUrl;

  }

  getWalletHistory = ( companyName, startDate, endDate, page) =>{
    let url = 'wallet?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    // if(type) {  url = url + '&type=' + type}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

  getEditorWalletHistory = ( companyName, startDate, endDate, page) => {
    let url = 'editorWallet?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    // if(type) {  url = url + '&type=' + type}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

  addCredit = (body) => {
    return this.http.post(this.serverUrl + 'wallet/addCredit' , body, getHeaders('application/json'))
  }
  useCredit = (body) => {
    return this.http.post(this.serverUrl + 'wallet/useCredit' , body, getHeaders('application/json'))
  }

  purchaseRazorPay = (data) => {
    return this.http.post(this.serverUrl + 'payment/purchaseRazorPayWallet' , data, getHeaders('application/json'))
  }

  signatureRazorPay= (data) => {
    return this.http.post(this.serverUrl + 'payment/signatureRazorPayWallet' , data, getHeaders('application/json'))
  }

  

}
