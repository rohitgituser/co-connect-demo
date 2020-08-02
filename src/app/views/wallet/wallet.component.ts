import { Component, OnInit } from '@angular/core';
import { WalletService } from '../../services/wallet.service';
import { paginationMaxSize } from '../../utilities/common'
import { MastersService } from '../../services/masters.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import _ from "lodash";
import * as moment from 'moment';
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
  creditSubmitted: boolean = false;
  showError: string = '';
  constructor(
    private walletService: WalletService,
    private mastersService: MastersService,
    private formBuilder: FormBuilder,

    ) { }

  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let today = new Date()
    let toDate = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
  
    this.getWalletList('', this.fromDate, this.toDate, '1');

    this.creditForm =  this.formBuilder.group({
      selectedCompany: ['', Validators.required],
      type: ['', Validators.required],
      description: ['', Validators.required],
      amount: ['', Validators.required],
    });
  }

  get cForm() { return this.creditForm.controls;}

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

  onCreditSubmit(){
    this.creditSubmitted = true;
    this.showError = '';
    if(this.creditForm.invalid){
      return false;
    };
    console.log(this.selectedCompanyObj);
    if( _.isEmpty(this.selectedCompanyObj)){
      this.showError = "Company Not Selected. Please Select company from suggestion."
      return false;
    }
    let values = this.creditForm.value;
    values.userId = this.selectedCompanyObj._id;
    console.log(this.selectedCompanyObj);
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
    return this.currentUser.credit + '₹';
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
