import { Injectable } from '@angular/core';
import _ from "lodash";
import * as moment from 'moment';

type MyArrayType = Array<{id: string, companyName: string, coNo: string, destination: string, status: string, date: string, plImage: string, plThumbnail:string }>;

// type StatesArray =  Array<{name: string }>;
const PLList: MyArrayType = [
  ] ;

const statesOfIndia =[ "Andhra Pradesh",
"Arunachal Pradesh",
"Assam",
"Bihar",
"Chhattisgarh",
"Goa",
"Gujarat",
"Haryana",
"Himachal Pradesh",
"Jammu and Kashmir",
"Jharkhand",
"Karnataka",
"Kerala",
"Madhya Pradesh",
"Maharashtra",
"Manipur",
"Meghalaya",
"Mizoram",
"Nagaland",
"Odisha",
"Punjab",
"Rajasthan",
"Sikkim",
"Tamil Nadu",
"Telangana",
"Tripura",
"Uttarakhand",
"Uttar Pradesh",
"West Bengal",
"Andaman and Nicobar Islands",
"Chandigarh",
"Dadra and Nagar Haveli",
"Daman and Diu",
"Delhi",
"Lakshadweep",
"Puducherry"
]


@Injectable({
  providedIn: 'root'
})
export class GeneralServiceService {

  constructor() { }

  getPlList(){
    return [];
  }
  getCoList (){
    return [];
  }
  getPlById(id){
    return _.find(PLList, (pl) => { return pl.id == id})
  }
  getStatesList(){
    return statesOfIndia;
  }
}
