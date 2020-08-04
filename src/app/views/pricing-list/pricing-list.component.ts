import { Component, OnInit } from '@angular/core';
import { MastersService } from '../../services/masters.service';
import { paginationMaxSize } from '../../utilities/common'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pricing-list',
  templateUrl: './pricing-list.component.html',
  styleUrls: ['./pricing-list.component.css']
})
export class PricingListComponent implements OnInit {

  currentCost: Object;
  page: any =1;
  priceList:Object[];
  pagination: object;
  searchText: string;
  maxSize: number = paginationMaxSize;
  nonMembersCont: string = '';
  membersCont: string = '';
  showError:  string = '';
  constructor(private mastersService: MastersService, private toastr: ToastrService ) { }

  ngOnInit(): void {
    this.pagination = {
      numOfResults: 0,
      currentPage: 1,
      perPage: 5
    }
    this.getPriceList('', this.page)
  }

  getPriceList(name, page){

    this.mastersService.getPricingList(name, page).subscribe(data => {

      this.priceList = data['data'].costs;
      this.pagination = data['data'].pagination;
      if(!this.pagination) { 
        // no data was found  so set default 
        this.pagination = {
          numOfResults: 0,
          currentPage: 1,
          perPage: 5
        }
        this.page = this.pagination["currentPage"];
      }

     });
  }

  nameChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchText = name;
    if(name && this.searchText.length > 2 ){
     this.getPriceList(this.searchText, '1')
    }
    if(!name){
      this.getPriceList(this.searchText, '1')
    }

  }

  editCostClicked(cost){
    
    this.currentCost = cost;
  }

  pageChanged(event: any): void {
    if (event && !isNaN(event) && event != this.pagination['currentPage']) {
    this.getPriceList(this.searchText, event)
    }
  }

  clearModel(){
    this.currentCost = {};
  }

  savePricing(pricing){
    this.showError = '';
    console.log('pricing', pricing);

    if(!pricing.costForMember || !pricing.costForNonMember){
      this.showError = "Both Values are required."
    }
    this.mastersService.updatePricing(pricing).subscribe(data => {
      if(data['status'] == "success"){

        this.toastr.success('', "Pricing updated successfully.");
        document.getElementById("editPricingModelCLoseButton").click();
        this.getPriceList('', '1')

      }
    });
  }


}
