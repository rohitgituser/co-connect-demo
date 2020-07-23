import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from '../../services/general-service.service';
import {Router,ActivatedRoute} from "@angular/router";
import { NgxImageZoomModule } from 'ngx-image-zoom';
@Component({
  selector: 'app-co',
  templateUrl: './co.component.html',
  styleUrls: ['./co.component.css']
})
export class CoComponent implements OnInit {

  constructor(private generalServiceService : GeneralServiceService, private route: ActivatedRoute,private router:Router,) { 
    var coId = this.route.snapshot.paramMap.get("id");
    this.coId = coId;
  }

  coObject:object;
  coId:String;
  
  imageObject: Array<object> = [];  

  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  

  ngOnInit(): void {
    this.coObject = this.generalServiceService.getPlById(this.coId);
    this.imageObject.push({
      image: 'assets/img/brand/coSample.jpg',
      thumbImage: 'assets/img/brand/coSample.jpg',
      title: "Certificate Of Origin"
    },
    {
      image: 'assets/img/brand/chalan.jpg',
      thumbImage: 'assets/img/brand/chalan.jpg',
      title: " Invoice cum Receipt"
    }
    )
   

  }
  getCoObject() {
    return this.coObject;
  }

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
}

closeEventHandler() {
  this.showFlag = false;
  this.selectedImageIndex = -1;
}

 

}
