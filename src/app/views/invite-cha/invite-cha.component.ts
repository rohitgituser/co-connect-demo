import { Component, OnInit } from '@angular/core';
import { MastersService } from '../../services/masters.service';
import * as _ from "lodash";
import * as moment from 'moment';

import { paginationMaxSize } from '../../utilities/common'
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-invite-cha',
  templateUrl: './invite-cha.component.html',
  styleUrls: ['./invite-cha.component.css']
})
export class InviteChaComponent implements OnInit {

  constructor(private mastersService: MastersService, private toastr: ToastrService) { }
  usersList: [];
  searchList: [];
  accountType: string[];
  selectedAccountType: string;
  searchText: string;
  searchCHAText: string;
  searchCHAEmailText: string;
  pagination:any;
  currentUser: any;
  page:any = 1;
  maxSize: number = paginationMaxSize;
  selectedUser: any;
  membersValidity: any;
  isMember: any;
  profileValidity: any;
  newCHA: boolean = false;
  newCHAEmail: string = '';
  ngOnInit(): void {

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    this.accountType = ["Active", "In-Active"];
    this.getExportersCHAList('', this.page);
     this.pagination = {
      numOfResults: 0,
      currentPage: 1,
      perPage: 5
    }
   
    if(_.isEmpty(this.usersList) ){
      this.usersList = [];
    }
  }


  getExportersCHAList (name: string, page:any){
    let exporterId = this.currentUser._id;
    this.mastersService.getExportersAgentsList(exporterId,name, page).subscribe(data => {

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
    this.getExportersCHAList(this.searchText, event)
    }
  }

  locationClicked(event): void{
    this.selectedAccountType = event.target.value;
      this.getExportersCHAList(this.searchText, '1')
  }

  nameChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchText = name;
    if(name && this.searchText.length > 2 ){
     this.getExportersCHAList(this.searchText, '1')
    }
    if(!name){
      this.getExportersCHAList(this.searchText, '1')
    }

  }

  searchCHANameChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchCHAText = name;
    if(name && this.searchCHAText.length > 2 ){
     this.mastersService.findNewCHAByName(this.searchCHAText).subscribe(data => {

      this.searchList = data['data'].users;
     });
    }
    if(!name){
      this.mastersService.findNewCHAByName(this.searchCHAText).subscribe(data => {

        this.searchList = data['data'].users;
      });
  
    }

  }

  searchCHAEmailChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchCHAEmailText = name;
    if(name && this.searchCHAEmailText.length > 2 ){
     this.mastersService.findNewCHAByEmail(this.searchCHAEmailText).subscribe(data => {

      this.searchList = data['data'].users;
     });
    }
    
    if(!name){
      this.mastersService.findNewCHAByEmail(this.searchCHAEmailText).subscribe(data => {

        this.searchList = data['data'].users;
       });
    }
  }


  viewClicked(user){
    let today = new Date();
    this.selectedUser = user ;
    let coReferenceDate =  new Date(this.selectedUser.coReferenceDate);
    this.selectedUser.coReferenceDateMoment = moment(coReferenceDate).format("L");
    this.isMember = this.selectedUser['isMember'];
    console.log(this.selectedUser.chaExporters.indexOf(this.currentUser._id) )
    if(this.selectedUser.chaExporters.indexOf(this.currentUser._id) !== -1){
      this.newCHA = true;
    }
    this.membersValidity = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    this.profileValidity = new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0];
    if(this.selectedUser['membersValidity']){
      this.membersValidity = new Date(this.selectedUser['membersValidity']).toISOString().split('T')[0];
    }
    if(this.selectedUser['profileValidity']){
      this.profileValidity = new Date(this.selectedUser['profileValidity']).toISOString().split('T')[0];
    }
  }

  inviteCHAExporter = (user) =>{
    this.mastersService.inviteCHAByExporter(user).subscribe(data => {

      if(data['status']== 'success'){
        this.getExportersCHAList(this.searchText, '1');
        this.searchList = [];
        document.getElementById("closeViewUserModalButton").click();
      }

     });
  }

  rejectCHA = (user) =>{
    this.mastersService.removeCHAByExporter(user).subscribe(data => {

      if(data['status']== 'success'){
        this.getExportersCHAList(this.searchText, '1');
        this.searchList = [];
        document.getElementById("closeViewUserModalButton").click();
      }

     });
  }

  inviteNewCHA(email){

    this.mastersService.inviteNewCHA(email).subscribe(data => {

      if(data['status']== 'success'){
       
        document.getElementById("closeInviteCHAModalButton").click();
        this.toastr.success('', "Invitation Sent");
      }

      if(data['status'] == 'error'){
        this.toastr.error('', data['message']);

      }

     });

  }


}
