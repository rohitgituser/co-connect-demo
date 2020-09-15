import { Component, OnInit } from '@angular/core';
import { MastersService } from '../../services/masters.service';
import * as _ from "lodash";
import * as moment from 'moment';

import { paginationMaxSize } from '../../utilities/common'
@Component({
  selector: 'app-cha-list',
  templateUrl: './cha-list.component.html',
  styleUrls: ['./cha-list.component.css']
})
export class ChaListComponent implements OnInit {

  constructor(private mastersService: MastersService) { }
  usersList: [];
  accountType: string[];
  selectedAccountType: string;
  searchText: string;
  pagination:any;
  page:any = 1;
  maxSize: number = paginationMaxSize;
  selectedUser: any;
  membersValidity: any;
  isMember: any;
  profileValidity: any;

  ngOnInit(): void {

    this.accountType = ["Active", "In-Active"];
    this.getUsersList('', '', this.page);
     this.pagination = {
      numOfResults: 0,
      currentPage: 1,
      perPage: 5
    }
   
    if(_.isEmpty(this.usersList) ){
      this.usersList = [];
    }
  }

  getUsersList (name: string, type:String, page:any){
    this.mastersService.getAllAgentsList(name, type, page).subscribe(data => {

      this.usersList = data['data'].users;
      this.pagination = data['data'].pagination;
      if(!this.pagination) { 
        // no data was found  so set default 
        this.pagination = {
          numOfResults: 0,
          currentPage: 1,
          perPage: 5
        }
        this.page = this.pagination.currentPage;
      }

     });
  }

  pageChanged(event: any): void {
    if (event && !isNaN(event) && event != this.pagination.currentPage) {
    this.getUsersList(this.searchText, this.selectedAccountType, event)
    }
  }

  locationClicked(event): void{
    this.selectedAccountType = event.target.value;
      this.getUsersList(this.searchText, this.selectedAccountType, '1')
  }

  nameChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchText = name;
    if(name && this.searchText.length > 2 ){
     this.getUsersList(this.searchText, this.selectedAccountType, '1')
    }
    if(!name){
      this.getUsersList(this.searchText, this.selectedAccountType, '1')
    }

  }

  viewClicked(user){
    let today = new Date();
    this.selectedUser = user ;
    let coReferenceDate =  new Date(this.selectedUser.coReferenceDate);
    this.selectedUser.coReferenceDateMoment = moment(coReferenceDate).format("L");
    this.isMember = this.selectedUser['isMember'];
    console.log(this.isMember)

    console.log(this.selectedUser)
    this.membersValidity = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    this.profileValidity = new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0];
    if(this.selectedUser['membersValidity']){
      this.membersValidity = new Date(this.selectedUser['membersValidity']).toISOString().split('T')[0];
    }
    if(this.selectedUser['profileValidity']){
      this.profileValidity = new Date(this.selectedUser['profileValidity']).toISOString().split('T')[0];
    }
  }

}
