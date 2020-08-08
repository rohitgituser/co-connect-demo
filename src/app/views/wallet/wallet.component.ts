import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { paginationMaxSize } from '../../utilities/common'
import { MastersService } from '../../services/masters.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import _ from "lodash";
import * as moment from 'moment';
import { ExternalLibraryService } from '../util';
import { ToastrService } from 'ngx-toastr';

declare var Razorpay: any; 

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.css']
})
export class WalletComponent implements OnInit {

  walletList: any;
  currentUser: any;
  searchText: string= '';
  fromDate: any;
  toDate: any;
  maxSize: number = paginationMaxSize;
  pagination: any = {
    currentPage: 1,
    nextPage: 1,
    numOfResults: 0,
    pages: 1,
    perPage: 5
  };
  page: any = 1;
  companyList: any;
  selectedCompany: string = '';
  selectedCompanyObj: any;
  creditForm: FormGroup;
  creditUserForm: FormGroup;
  creditSubmitted: boolean = false;
  creditUserSubmitted: boolean = false;
  razorPayOptions: any;
  showError: string = '';
  constructor(
    private walletService: WalletService,
    private mastersService: MastersService,
    private formBuilder: FormBuilder,
    private razorpayService: ExternalLibraryService,
    private toastr: ToastrService,

    ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let today = new Date()
    let toDate = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
    this.razorpayService
    .lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js')
    .subscribe();
    this.getWalletList('', this.fromDate, this.toDate, '1');
    this.razorPayOptions = {
      "key": '', 
      "amount": '', 
      "currency": "INR",
      "name": "",
      "description": "Co Request Payment",
      "order_id":"",
      "image": "",
      "handler": function (response) {
      },
      "notes": {
      },
      "theme": {
          "color": "#8bf7a8"
      },
  };
    this.creditForm =  this.formBuilder.group({
      selectedCompany: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
    this.creditUserForm = this.formBuilder.group({
      // selectedCompany: ['', Validators.required],
      // type: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  get cForm() { return this.creditForm.controls;}
  get cUserForm() { return this.creditUserForm.controls;}

  getWalletList(searchText, from, to, page){
    if(this.currentUser['role'] == 'user'){
      this.walletService.getWalletHistory(searchText, from, to, page).subscribe(data => {
        if(data['status'] == "success"){
          this.pagination = data['data']['pagination'];
          if(!this.pagination){
            this.pagination = {
              currentPage: 1,
              nextPage: 1,
              numOfResults: 0,
              pages: 1,
              perPage: 5
            };
          }
          this.page = this.pagination['currentPage'];
          this.walletList = data['data']['walletList'];
        }

      });

    }else{
      this.walletService.getEditorWalletHistory(searchText, from, to, page).subscribe(data => {
        if(data['status'] == "success"){
          this.pagination = data['data']['pagination'];
          if(!this.pagination){
            this.pagination = {
              currentPage: 1,
              nextPage: 1,
              numOfResults: 0,
              pages: 1,
              perPage: 5
            };
          }
          this.page = this.pagination['currentPage'];
          this.walletList = data['data']['walletList'];
        }

      });

    }
  }

  getCompany(name): void {
    if (name && name.length > 2) {
        this.mastersService.getBaUsers(name).subscribe(data => {

            this.companyList = data['data'];

        });
    }
    if (name && name.length <= 2) {
        this.companyList = [];
        this.selectedCompanyObj = {}
    }
    if (!name) {
        this.selectedCompany = '';
        this.selectedCompanyObj= {}
        // this.getUsers(this.selectedCompany)

    }

  }
  companyClicked(company): void {
    this.selectedCompany = company.companyName;
    this.selectedCompanyObj = company
    this.companyList = [];
    // this.getUsers(this.searchText, this.selectedCompany, '')
  }

  onCreditUserSubmit(){
    this.creditUserSubmitted = true;
    this.showError = '';
    if(this.creditUserForm.invalid){
      return false;
    };
    let values =  this.creditUserForm.value;
    let finalObject = {
      "userId": this.currentUser._id,
      "amount": Number(values.amount),
      "type": "Credit",
      "companyName": this.currentUser.companyName,
      "buyerName": this.currentUser.companyName,
      "description": values.description,
      "userName": this.currentUser['contactPersonName'],
      "userEmail": this.currentUser['email'],
     
    }
    this.walletService.purchaseRazorPay(finalObject).subscribe(response => {
      let payload = response['payload'];

      if (payload["key"] && payload["dbRes"]["order"]["id"] && payload["dbRes"]["order"]["amount"]) {
        this.razorPayOptions.key = payload["key"];
        this.razorPayOptions.order_id = payload["dbRes"]["order"]["id"];
        this.razorPayOptions.amount =  payload["dbRes"]["order"]["amount"];
        this.razorPayOptions.handler =  this.razorPayResponseHandler;
        // this.payment_creation_id = payload["dbRes"]["_id"];
        finalObject["_id"] =payload["dbRes"]["_id"]
        sessionStorage.setItem("temp",JSON.stringify(finalObject))

  
      var rzp1 = new Razorpay(this.razorPayOptions);
      rzp1.open();
      } else {
        // bro show error here
      }
    }, (error) => {
      console.log("error", error);
    });
  }

  razorPayResponseHandler = (response) => {
    let storage_data =sessionStorage.getItem('temp') 
    let sess =  JSON.parse(storage_data);
    let paymentObject= {
      _id:sess._id,
      payment:response,
      razorpay_order_id: response['razorpay_order_id'],
      razorpay_payment_id: response['razorpay_payment_id'],
      razorpay_signature: response['razorpay_signature'],
      certificateId:sess.certificateId,
      amount: sess.amount,
      userEmail:sess.userEmail,
      userName:sess.userName,
      userId: sess.userId,
      "type": "Credit",
      "companyName": sess.companyName,
      "buyerName": sess.companyName,
      "description": sess.description,
    }
  
    this.walletService.signatureRazorPay(paymentObject).subscribe(response => {
  
      if(response['status'] == 'success'){
        let currentUser = response['data']['user'];
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.currentUser.credit = currentUser.credit;
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.toastr.success('', 'Payment Successful');
        document.getElementById("closeCreditUsersModelButton").click();
        this.getWalletList(this.searchText, this.fromDate, this.toDate,  this.page)
      }
    }, (error) => {
      console.log("error", error);
    });
  }

  onCreditSubmit(){
    this.creditSubmitted = true;
    this.showError = '';
    if(this.creditForm.invalid){
      return false;
    };
    if( _.isEmpty(this.selectedCompanyObj)){
      this.showError = "Company Not Selected. Please Select company from suggestion."
      return false;
    }
    let values = this.creditForm.value;
    values.userId = this.selectedCompanyObj._id;
    values.companyName = this.selectedCompanyObj.companyName;
    this.walletService.addCredit(values).subscribe(data => {
      if(data['status'] == "success"){
        document.getElementById('closeCreditModelButton').click();
        this.creditForm.reset();
        this.creditSubmitted = false;
        this.showError = '';

        this.getWalletList(this.searchText, this.fromDate, this.toDate,this.page)
      }
    });
  }

  pageChanged(event: any): void {
    if (event && !isNaN(event) && event != this.pagination.currentPage) {
    this.getWalletList(this.searchText, this.fromDate, this.toDate,this.page)
    }
  }

  getCurrentUserCredit(){
    return this.currentUser.credit ? this.currentUser.credit + ' ₹' : '0 ₹';
  }

  updateFilter(searchText: String, startDate: String, endDate: String): void {

    this.getWalletList(searchText, startDate, endDate, '1');

  }

  callClear() {
    let today = new Date();
    let toDate = new Date();
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
    this.getWalletList('', this.fromDate, this.toDate, '1');

  }



}
