import { Injectable } from '@angular/core';
import _ from "lodash";
import * as moment from 'moment';

type MyArrayType = Array<{id: string, companyName: string, coNo: string, destination: string, status: string, date: string, plImage: string, plThumbnail:string }>;

const PLList: MyArrayType = [
      {  id: '001122', 
      companyName: "Mahindra and Mahindra Ltd", 
      coNo: "8549997113", 
      date: moment('2020-04-30').toISOString(), 
      destination: "United Kingdom", 
      status: "Pending" ,
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001121', 
      companyName: "Mahindra and Mahindra Ltd", 
      coNo: "8549997113", 
      date: moment('2020-04-17').toISOString(), 
      destination: "United Kingdom", 
      status: "Issued" ,
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    
    {  id: '001120', 
      companyName: "Volkswagen Motors  Ltd", 
      coNo: "3478980990", 
      date: moment('2020-04-10').toISOString(), 
      destination: "Italy", 
      status: "Pending",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
     
    },
    {  id: '001119', 
      companyName: "Xiomi India Pvt", 
      coNo: "9623862878", 
      date: moment('2020-04-10').toISOString(),
      destination: "France", 
      status: "Rejected",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001118', 
      companyName: "Skoda Auto  Ltd", 
      coNo: "6877465846", 
      date: moment('2020-04-11').toISOString(),
      destination: "Germany", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001117', 
      companyName: "Audi Auto  Ltd", 
      coNo: "98764626221", 
      date: moment('2020-04-12').toISOString(),
      destination: "Iran", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001116', 
      companyName: "Real-Mi India Pvt", 
      coNo: "432676281", 
      date:moment('2020-04-15').toISOString(),
      destination: "Dubai", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
      
    },
    {  id: '001115', 
      companyName: "BMW Auto Pvt", 
      coNo: "9076675341", 
      date: moment('2020-04-14').toISOString(),
      destination: "Germany", 
      status: "Rejected",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001114', 
      companyName: "Spykar Lifestyles Pvt. Ltd", 
      coNo: "8977331143", 
      date: moment('2020-04-16').toISOString(),
      destination: "United Kingdom", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001113', 
      companyName: "Allen Solly Pvt. Ltd", 
      coNo: "8781208342", 
      date: moment('2020-04-09').toISOString(),
      destination: "Dubai", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '001112', 
      companyName: "Amrut distillery Pvt. Ltd", 
      coNo: "7095516542", 
      date: moment('2020-04-08').toISOString(),
      destination: "United Kingdom", 
      status: "Pending",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
  ] ;

  const CoList: MyArrayType = [
    {  id: '00112', 
      companyName: "Mahindra and Mahindra Ltd", 
      coNo: "8549997113", 
      date: moment('2020-04-17').toISOString(),
      destination: "United Kingdom", 
      status: "Issued",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    
    {  id: '00113', 
      companyName: "Volkswagen Motors  Ltd", 
      coNo: "3478980990", 
      date:moment('2020-04-13').toISOString(),
      destination: "Italy", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
     
    },
    {  id: '00110', 
      companyName: "Xiomi India Pvt", 
      coNo: "9623862878", 
      date: moment('2020-04-17').toISOString(),
      destination: "France", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '00109', 
      companyName: "Skoda Auto  Ltd", 
      coNo: "6877465846", 
      date: moment('2020-04-11').toISOString(),
      destination: "Germany", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '00114', 
      companyName: "Audi Auto  Ltd", 
      coNo: "98764626221", 
      date:moment('2020-04-19').toISOString(),
      destination: "Iran", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '00115', 
      companyName: "Real-Mi India Pvt", 
      coNo: "432676281", 
      date:moment('2020-04-20').toISOString(),
      destination: "Dubai", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '00115', 
      companyName: "BMW Auto Pvt", 
      coNo: "9076675341", 
      date: moment('2020-04-22').toISOString(),
      destination: "Germany", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
    {  id: '00121', 
      companyName: "Spykar Lifestyles Pvt. Ltd", 
      coNo: "8977331143", 
      date: moment('2020-04-23').toISOString(),
      destination: "United Kingdom", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
   
    {  id: '00123', 
      companyName: "Amrut distillery Pvt. Ltd", 
      coNo: "7095516542", 
      date: moment('2020-04-08').toISOString(),
      destination: "United Kingdom", 
      status: "Active",
      plImage: "https://wittlock.github.io/ngx-image-zoom/assets/fullres.jpg",
      plThumbnail: "https://wittlock.github.io/ngx-image-zoom/assets/thumb.jpg"
    },
  ] ;


@Injectable({
  providedIn: 'root'
})
export class GeneralServiceService {

  constructor() { }

  getPlList(){
    return PLList;
  }
  getCoList (){
    return CoList;
  }
  getPlById(id){
    return _.find(PLList, (pl) => { return pl.id == id})
  }
}
