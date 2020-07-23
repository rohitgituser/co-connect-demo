import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators'
import { handleError, getHeaders, checkIfNull, getHeadersWithNoContentType } from '../utilities/common'
import { ConstantService } from './constant.service';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  public serverUrl = "";

  constructor(private http: HttpClient, public ConstService:ConstantService) { 
    this.serverUrl = ConstService.serverUrl;

  }

  createCertificate= (data) => {
    return this.http.post(this.serverUrl + "certificate", data, getHeaders('application/json'))
  }
  editCertificate = (data, certificateId) => {
    return this.http.put(this.serverUrl + "certificate/" + certificateId, data, getHeaders('application/json'))
  }

  getCertificates = ( companyName, startDate, endDate, type, page) =>{
    let url = 'certificate?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    if(type) {  url = url + '&type=' + type}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }

  getEditorCertificates = ( companyName, startDate, endDate, type, page) => {
    let url = 'editorCertificate?';
    if(companyName) {  url = url + '&companyName=' + companyName}
    if(startDate) {  url = url + '&startDate=' + startDate}
    if(endDate) {  url = url + '&endDate=' + endDate}
    if(type) {  url = url + '&type=' + type}
    if(page) {  url = url + '&page=' + page }else{  url = url + '&page=1' }

    return this.http.get(this.serverUrl + url, getHeaders('application/json'))

  }


  getCertificateByID = (id) =>{
    return this.http.get(this.serverUrl + 'certificate/'+ id, getHeaders('application/json'))

  }

  getCertificateByReference = (referenceNo) =>{
    return this.http.post(this.serverUrl + 'certificate/reference/number/', {referenceNumber: referenceNo}, getHeaders('application/json'))

  }

  uploadCertificateDocuments = (postBody: FormData, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/uploadAdditionalDoc/${certificateId}`, postBody, getHeadersWithNoContentType()).pipe(catchError(handleError))
  }

 

  uploadCertificateDocumentAndReplace = (postBody: FormData, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/uploadAdditionalDocAndReplace/${certificateId}`, postBody, getHeadersWithNoContentType()).pipe(catchError(handleError))
  }

  uploadCOCertificateDocuments = (postBody: FormData, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/uploadCODoc/${certificateId}`, postBody, getHeadersWithNoContentType()).pipe(catchError(handleError))
  }

  saveCertificateDocuments= (postBody: any, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/saveAdditionalDoc/${certificateId}`, postBody, getHeadersWithNoContentType()).pipe(catchError(handleError))
  }

  requestOTP = (email: string, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/requestOTP/${certificateId}`, {email: email},getHeaders('application/json'))
  }

  verifyOTP = (otp: any, certificateId: string) => {
    return this.http.post(this.serverUrl + `certificate/verifyOTP/${certificateId}`, {otp: otp}, getHeaders('application/json'))
  }

  createInvoice = (invoice: any) => {
    return this.http.post(this.serverUrl + 'invoice', invoice, getHeaders('application/json'))
  }

  getInvoiceById = (invoiceId:string) => {
    return this.http.get(this.serverUrl + 'invoice/' + invoiceId, getHeaders('application/json'))
  }
  getCertificateByRef = (referenceNo:string) => {
    return this.http.post(this.serverUrl + 'certificate/reference/number/', {referenceNumber: referenceNo})
  }

  addInvoiceToCertificate = (certificateId, invoiceId, invoiceDate) =>{
    return this.http.post(this.serverUrl + 'certificate/addInvoiceToCertificate/' + certificateId, {invoiceId: invoiceId, invoiceDate: invoiceDate}, getHeaders('application/json'))

  }


  updateEditorAction = (certificate) => {
    return this.http.post(this.serverUrl + 'editorCertificate/editorAction/' + certificate._id, {editorAction : certificate.editorAction, editorReason: certificate.editorReason}, getHeaders('application/json'))
  }
  rejectCertificate = (certificate) => {
    return this.http.post(this.serverUrl + 'editorCertificate/reject/' + certificate._id, {rejectionReason : certificate.rejectionReason}, getHeaders('application/json'))
  }

  acceptCertificate = (certificate) => {
    return this.http.post(this.serverUrl + 'editorCertificate/accept/' + certificate._id, {issuedBy : certificate.issuedBy, issuedById: certificate.issuedById}, getHeaders('application/json'))
  }

  payAmountClicked = (invoiceId, certificateId) => {
    return this.http.post(this.serverUrl + 'certificate/pay/' + certificateId + '/' + invoiceId, {invoiceId : invoiceId,certificateId: certificateId }, getHeaders('application/json'))
  }

  getBase64Format = (url) => {
    return this.http.post(this.serverUrl + 'certificate/base64/' , {url : url }, getHeaders('application/json'))

  }

  sendXMLToSign = (data)=> {
    let  headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'text/xml');
    headers = headers.append('Accept', 'text/xml');
    const encoded = encodeURI('http://127.0.0.1:1620');

    return this.http.post( encoded, encodeURIComponent(data), { headers: headers, responseType: 'text' });

  }

  uploadXMLSignedDocument = (data)=>{
    return this.http.post(this.serverUrl + 'certificate/uploadXML/signedDocument' , data, getHeaders('application/json'))

  }

}
