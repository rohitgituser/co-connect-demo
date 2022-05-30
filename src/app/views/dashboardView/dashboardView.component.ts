import { Component, OnInit } from '@angular/core';
import _ from "lodash";
import { CertificateService } from '../../services/certificate.service';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboardView',
  templateUrl: './dashboardView.component.html',
  styleUrls: ['./dashboardView.component.css']
})
export class DashboardViewComponent implements OnInit {
  
  constructor(    private certificateService: CertificateService    ) { }
  buttonType:string;
  reportCount: any;
  // lineChart
  public lineChartData: Array<any> = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Members'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Non-Members'},
    // {data: [18, 48, 77, 9, 100, 27, 40], label: 'Series C'}
  ];
  public lineChartLabels: Array<any> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', "Nov", 'Dec'];
  public lineChartOptions: any = {
    animation: false,
    responsive: true,
    horizontalLine: [{  // use custom global plugin
      y: 82,
      style: 'rgba(255, 0, 0, .4)',
      text: 'max'
    }, {
      y: 60,
      style: '#00ffff',
    }, {
      y: 44,
      text: 'min'
    }],
    

  };
  public lineChartColours: Array<any> = [
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    { // dark grey
      backgroundColor: 'rgba(77,83,96,0.2)',
      borderColor: 'rgba(77,83,96,1)',
      pointBackgroundColor: 'rgba(77,83,96,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    },
    { // grey
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: 'rgba(148,159,177,1)',
      pointBackgroundColor: 'rgba(148,159,177,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';

  // barChart
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartType = 'bar';
  public barChartLegend = true;

  public barChartData: any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Members'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Non-Members'}
  ];

  // Doughnut
  public doughnutChartLabels: string[] = ['Created', 'Submitted', 'Issued', 'Rejected'];
  public doughnutChartData: number[] = [0,0,0,0];
  public doughnutChartType = 'doughnut';

  imagesUrl:object;
 
  ngOnInit(): void {
    this.imagesUrl = [{image:'assets/img/fdpAds/Slide1.png', thumbImage:'assets/img/fdpAds/Slide1.png'}, {image:'assets/img/fdpAds/Slide2.png', thumbImage:'assets/img/fdpAds/Slide2.png'}, {image:'assets/img/fdpAds/Slide3.png', thumbImage:'assets/img/fdpAds/Slide3.png'}, {image:'assets/img/fdpAds/Slide1.png', thumbImage:'assets/img/fdpAds/Slide1.png'}];    
    // this.imagesUrl = ['assets/img/brand/DCCIA-Slides.png', 'assets/img/brand/DCCIA-Slides_1.png', 'assets/img/brand/DCCIA-Slides_2.png'];    
    if (sessionStorage.getItem('checkAlert') !== 'true') {
      document.getElementById("openModalButton").click();
    }

    this.buttonType = "Year";
    // this.yearReport();
    this.dayReport();
    // this.certificateService.getExporterReport('Day').subscribe(data => {
    //   if(data['status'] == "success"){
    //     this.reportCount = data['data'];
    //   }
    // });
  }

  adRedirect = () => {
    window.open("https://app.fdpconnect.com", "_blank");
   }

   dayReport(): void{
    this.buttonType = "Day";

    this.certificateService.getExporterReport('Day').subscribe(data => {
      if(data['status'] == "success"){
        this.reportCount = data['data'];
        this.doughnutChartData = [ this.reportCount.createdCount, this.reportCount.submittedCount, this.reportCount.issuedMembersCount + this.reportCount.issuedNonMembersCount, this.reportCount.rejectedCount];
        console.log(' this.doughnutChartData',  this.doughnutChartData)
      } 
    });
  }

  yearReport(): void{
    this.buttonType = "Year";
    
    let currentYear = moment().year();
    this.lineChartLabels = [];
    this.barChartLabels = [];
    for(var i=0; i<=5; i++){
      this.lineChartLabels.unshift((currentYear-i).toString())
      this.barChartLabels .unshift((currentYear-i).toString())
    }
    // Line chart data
    this.lineChartData = [
      {data: [765, 559, 880, 581, 689, 235 ], label: 'Members'}, //3709
      {data: [428, 348, 440, 659, 344, 115], label: 'Non-Members'},//2334
    ];
    // this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', "Nov", 'Dec'];
    
    //bar chart 
    this.barChartData=[
      {data: [65, 59, 80, 55, 89, 35 ], label: 'Members'},
      {data: [28, 48, 40, 59, 44, 15], label: 'Non-Members'},
    ];

    // this.doughnutChartData = [3709, 2334];

  }
  quarterReport(): void{
    this.buttonType = "Quarter";
    this.certificateService.getExporterReport('Quarter').subscribe(data => {
      if(data['status'] == "success"){
        this.reportCount = data['data'];
        this.doughnutChartData = [ this.reportCount.createdCount, this.reportCount.submittedCount, this.reportCount.issuedMembersCount + this.reportCount.issuedNonMembersCount , this.reportCount.rejectedCount]

      }
    });
    // Line chart data
    this.lineChartData = [
      {data: [225, 110, 0, 0 ], label: 'Members'},
      {data: [80, 35, 0, 0], label: 'Non-Members'},
    ];
    this.lineChartLabels = ['Quarter-1', 'Quarter-2','Quarter-3','Quarter-4'];
    this.barChartLabels= ['Quarter-1', 'Quarter-2','Quarter-3','Quarter-4'];
    //bar chart 
    this.barChartData=[
      {data: [765, 110, 0, 0 ], label: 'Members'},
      {data: [440, 60, 0, 0], label: 'Non-Members'},
    ];

    // this.doughnutChartData = [235, 115];

  }
  monthReport(): void{
    this.buttonType = "Month";
    this.certificateService.getExporterReport('Month').subscribe(data => {
      if(data['status'] == "success"){
        this.reportCount = data['data'];
        this.doughnutChartData = [ this.reportCount.createdCount, this.reportCount.submittedCount, this.reportCount.issuedMembersCount + this.reportCount.issuedNonMembersCount , this.reportCount.rejectedCount]
      }
    });
     // Line chart data
     this.lineChartData = [
      {data: [75, 100, 50, 10, 0, 0 ,0, 0, 0,0, 0, 0], label: 'Members'},
      {data: [40, 40, 10, 25, 10, 0, 0, 0, 0, 0, 0,0], label: 'Non-Members'},
    ];
    this.lineChartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', "Nov", 'Dec'];
    this.barChartLabels= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', "Nov", 'Dec'];
    //bar chart 
    this.barChartData=[
      {data: [75, 100, 50, 10, 0, 0 ,0, 0, 0,0, 0, 0], label: 'Members'},
      {data: [40, 40, 10, 25, 10, 0, 0, 0, 0, 0, 0,0], label: 'Non-Members'},
    ];

    // this.doughnutChartData = [235, 115];

  }
  weekReport(): void{
    this.buttonType = "Week";
    this.certificateService.getExporterReport('Week').subscribe(data => {
      if(data['status'] == "success"){
        this.reportCount = data['data'];
        this.doughnutChartData = [ this.reportCount.createdCount, this.reportCount.submittedCount, this.reportCount.issuedMembersCount + this.reportCount.issuedNonMembersCount , this.reportCount.rejectedCount]

      }
    });
     // Line chart data
     this.lineChartData = [
      {data: [3,4,2,1, 0], label: 'Members'},
      {data: [10,12,3,0,0], label: 'Non-Members'},
    ];
    this.lineChartLabels = 
    this.barChartLabels= ['Week-1', 'Week-2', 'Week-3', 'Week-4', 'Week-5'];
    //bar chart 
    this.barChartData=[
      {data: [75, 100, 50, 10, 0, 0 ,0, 0, 0,0, 0, 0], label: 'Members'},
      {data: [40, 40, 10, 25, 10, 0, 0, 0, 0, 0, 0,0], label: 'Non-Members'},
    ];

    // this.doughnutChartData = [10, 25];

  }

}
