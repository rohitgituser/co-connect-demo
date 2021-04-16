import { Component, OnInit } from '@angular/core';
import _ from "lodash";
import * as moment from 'moment';
import { UserRole } from '../../enums/user-role';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

  constructor( private paymentService: PaymentService) { }
  paymentsList: object;
  user: Object;
  searchText: any = '';
  fromDate: any;
  toDate: any;
  pagination: any = {
    currentPage: 1,
    nextPage: 1,
    numOfResults: 0,
    pages: 1,
    perPage: 5
  };
  page1: any;
  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    let today = new Date();
    let toDate = new Date();
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
      this.getPayments('', this.fromDate, this.toDate , '1');
  } 

  callClear() {
    let today = new Date();
    let toDate = new Date();
    this.searchText = '';
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
    this.getPayments('', this.fromDate, this.toDate, '1');

  }

  getPayments(companyName: String, startDate:String, endDate: String, page: any){

    if(this.user && this.user["role"] == UserRole.BA || this.user["role"] == UserRole.ICC_AGENT){
      this.paymentService.getPayments(companyName, startDate,endDate, page).subscribe(data => {
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
          this.page1 = this.pagination['currentPage'];
          this.paymentsList = data['data']['payments'];

          _.forEach(this.paymentsList, pay => {
            let date = pay.transactionDate.split(' ');
            pay.transactionDateMoment = date[0].replace(/-/g, '/')          })
        }

      });
    }
    if(this.user && (this.user["role"] == UserRole.ICC_ADMIN || this.user["role"] == UserRole.ICC_EDITOR)){
      this.paymentService.getEditorPayments(companyName, startDate,endDate, page).subscribe(data => {
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
          this.page1 = this.pagination['currentPage'];
          this.paymentsList = data['data']['payments'];

          _.forEach(this.paymentsList, pay => {
            let date = pay.transactionDate.split(' ');
            pay.transactionDateMoment = date[0].replace(/-/g, '/')
          })
        }

      });
    }
}
  updateFilter(searchText: String, startDate: String, endDate: String): void {

    this.getPayments(searchText, startDate, endDate, '1');

  }


}
