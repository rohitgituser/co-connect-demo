import { Component, OnInit , ViewChild, ElementRef} from '@angular/core';
import { GeneralServiceService } from '../../services/general-service.service';
import _ from "lodash";
import * as moment from 'moment';
import { FormBuilder, FormGroup, Validators, FormArray} from '@angular/forms';
import { CertificateService } from '../../services/certificate.service';
import { ToastrService } from 'ngx-toastr';
import { LoadingScreenService } from '../loader/services/loading-screen.service';
import { async } from '@angular/core/testing';
import { paginationMaxSize } from '../../utilities/common'
import { MastersService } from '../../services/masters.service';
import { UserRole } from '../../enums/user-role';
import  {ezPAY} from '../../enums/ezPay-details';
import { MatStepper } from '@angular/material/stepper';
import * as CryptoJS from 'crypto-js';
import { DomSanitizer } from '@angular/platform-browser';
import { IfStmt } from '@angular/compiler';
import { WalletService } from '../../services/wallet.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.css']
})
export class Dashboard2Component implements OnInit {

  @ViewChild('createPlModal', {static: false}) createPlModal

  plList: Object;
  coList: Object;
  imageSrc: string;
  imageSrc2: string;
  progressPer2: number;
  progressPer1: number;
  ammntmentRequest: Boolean = false;
  coRequestFormGroup: FormGroup;
  coAmmendmentRequestFormGroup: FormGroup;
  coOTPFormGroup: FormGroup;
  isLinear: Boolean = false;
  items: FormArray;
  coSubmitted: Boolean =false;
  coAmmendmentRequestSubmitted:  Boolean =false;
  emailSubmitted: Boolean =false;
  page:any
  minLCDate: any;
  currentUser: Object;
  currentCertificate: any;
  currentInvoice: any;
  certificateMode: String;
  ammendmentMode: string;
  attachedDocuments: any[];
  showError: String ='';
  searchText: String ='';
  fromDate: any;
  toDate: any;
  currencyArray: string[];
  pagination: any = {
    currentPage: 1,
    nextPage: 1,
    numOfResults: 0,
    pages: 1,
    perPage: 5
  };
  pagination1: any = {
    currentPage: 1,
    nextPage: 1,
    numOfResults: 0,
    pages: 1,
    perPage: 5
  };
  page1: any = 1;
  enteredOTP: string;
  ezPayURL: string;
  maxSize: number = paginationMaxSize;
  pricingList: object[];
  companyConfig: object;
  certificateId: any;
  payment: object 
  payClicked: Boolean= false;
  notIssuedCertificate: Boolean = false;
  coRefCertInvalid: Boolean = false;
  uploadDocClicked: Boolean =false;
  constructor( private generalServiceService : GeneralServiceService, 
    private formBuilder: FormBuilder,
    private certificateService: CertificateService,
    private mastersService: MastersService,
    private toastr: ToastrService,
    private loadingService: LoadingScreenService,
    public sanitizer: DomSanitizer,
    private walletService: WalletService,

    ) { 
    
  }

  
  ngOnInit(): void {
    
    this.payment = {
      "merchantid": 0,
      "mandatory fields": 0,
      "optional fields": "0|0|0|0",
      "returnurl":'http://api.fdpconnect.com/api/v1/payment/returnurl',
      "Reference No": 0,
      "submerchantid": 0,
      "transaction amount": 0,
      "paymode": 9,

    }

    this.currencyArray = ['USD', 'INR', 'GBP'];

    this.payClicked = false;
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.ammntmentRequest = false;
    this.getCertificated('', this.fromDate, this.toDate, '1', '1');
    this.attachedDocuments = [];
    this.page= 1;
    let EmailPattern='[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$'
    let PasswordPattern = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    let panPattern = new RegExp("[A-Z]{5}[0-9]{4}[A-Z]{1}");
    let today = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
    this.toDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    this.coOTPFormGroup = this.formBuilder.group({
      email: ['', Validators.pattern(EmailPattern)],

    });
    this.coRequestFormGroup = this.formBuilder.group({
      // email: ['', Validators.pattern(EmailPattern)],
      exporter: [this.currentUser["companyName"] , Validators.required],
      exporterAddress: ['' , Validators.required],
      isNotifiedParty: [false],
      partyName: [''],
      partyAddress: [''],
      partyState: [''],
      partyCountry: [''],
      exporterState: ['', Validators.required],
      exporterCountry: ['India', Validators.required],
      consignee: ['', Validators.required],
      consigneeAddress: ['', Validators.required],
      consigneeState: [''],
      consigneeCountry: ['', Validators.required],
      iecNumber: [this.currentUser["iecNumber"], Validators.required],
      preCarriageBy: ['', Validators.required],
      placeOfReceipt: ['', Validators.required],
      VesselOrFlightNo: ['', Validators.required],
      loadingPort: ['', Validators.required],
      dischargePort: ['', Validators.required],
      finalDestination: ['', Validators.required],
      iccCooCode: ['', Validators.required],
      iccCooCodeDate: ['', Validators.required],
      lcNumber: [''],
      lcNumberDate: [''],
      lcNumberDateExpiry:[''],

      invoiceNumber: ['', Validators.required],
      invoiceNumberDate: ['', Validators.required],
      orderNumber: [''],
      orderNumberDate: [''],
      netWeight: ['', Validators.required],
      grossWeight: ['', Validators.required],
      totalValue: ['', Validators.required],
      valueCurrency: [this.currencyArray[0]],
      termsAccepted: [false, Validators.required],
      isCOEndorseRequired: [true, Validators.required],
      goods:this.formBuilder.array([ this.createGoodsItem() ])
    });

    this.coAmmendmentRequestFormGroup = this.formBuilder.group({
      // email: ['', Validators.pattern(EmailPattern)],
      exporter: [this.currentUser["companyName"] , Validators.required],
      exporterAddress: ['' , Validators.required],
      isNotifiedParty: [false],
      partyName: [''],
      partyAddress: [''],
      partyState: [''],
      partyCountry: [''],
      exporterState: ['', Validators.required],
      exporterCountry: ['India', Validators.required],
      consignee: ['', Validators.required],
      consigneeAddress: ['', Validators.required],
      consigneeState: [''],
      consigneeCountry: ['', Validators.required],
      oldCOReferenceNumber: ['', Validators.required],
      iecNumber: ['', Validators.required],
      preCarriageBy: ['', Validators.required],
      placeOfReceipt: ['', Validators.required],
      VesselOrFlightNo: ['', Validators.required],
      loadingPort: ['', Validators.required],
      dischargePort: ['', Validators.required],
      finalDestination: ['', Validators.required],
      iccCooCode: ['', Validators.required],
      iccCooCodeDate: ['', Validators.required],
      lcNumber: [''],
      lcNumberDate: [''],
      lcNumberDateExpiry:[''],

      invoiceNumber: ['', Validators.required],
      invoiceNumberDate: ['', Validators.required],
      orderNumber: [''],
      orderNumberDate: [''],
      netWeight: ['', Validators.required],
      grossWeight: ['', Validators.required],
      totalValue: ['', Validators.required],
      valueCurrency: [this.currencyArray[0]],
      termsAccepted: [false, Validators.required],
      isCOEndorseRequired: [true, Validators.required],
      goods:this.formBuilder.array([ this.createGoodsItem() ])
    });

    this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
    this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
    this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})


    this.mastersService.getConfig('companyConfig').subscribe(data => {
      if(data['status'] == "success"){
        this.companyConfig =  data['data'][0]['keyValue'];
      }
    });

   }

   

   cORequestInitial = ()=> {
    this.coRequestFormGroup = this.formBuilder.group({
      // email: ['', Validators.pattern(EmailPattern)],
      exporter: [this.currentUser["companyName"] , Validators.required],
      exporterAddress: ['' , Validators.required],
      isNotifiedParty: [false],
      partyName: [''],
      partyAddress: [''],
      partyState: [''],
      partyCountry: [''],
      exporterState: ['', Validators.required],
      exporterCountry: ['India', Validators.required],
      consignee: ['', Validators.required],
      consigneeAddress: ['', Validators.required],
      consigneeState: [''],
      consigneeCountry: ['', Validators.required],
      iecNumber: [this.currentUser["iecNumber"], Validators.required],
      preCarriageBy: ['', Validators.required],
      placeOfReceipt: ['', Validators.required],
      VesselOrFlightNo: ['', Validators.required],
      loadingPort: ['', Validators.required],
      dischargePort: ['', Validators.required],
      finalDestination: ['', Validators.required],
      iccCooCode: ['', Validators.required],
      iccCooCodeDate: ['', Validators.required],
      lcNumber: [''],
      lcNumberDate: [''],
      lcNumberDateExpiry: [''],
      invoiceNumber: ['', Validators.required],
      invoiceNumberDate: ['', Validators.required],
      orderNumber: [''],
      orderNumberDate: [''],
      netWeight: ['', Validators.required],
      grossWeight: ['', Validators.required],
      totalValue: ['', Validators.required],
      valueCurrency: [this.currencyArray[0]],

      termsAccepted: [false, Validators.required],
      isCOEndorseRequired: [true, Validators.required],
      goods:this.formBuilder.array([ this.createGoodsItem() ])
    });
   }
   coAmmendmentInitital = () =>{
    this.coAmmendmentRequestFormGroup = this.formBuilder.group({
      // email: ['', Validators.pattern(EmailPattern)],
      exporter: [this.currentUser["companyName"] , Validators.required],
      exporterAddress: ['' , Validators.required],
      isNotifiedParty: [false],
      partyName: [''],
      partyAddress: [''],
      partyState: [''],
      partyCountry: [''],
      exporterState: ['', Validators.required],
      exporterCountry: ['India', Validators.required],
      consignee: ['', Validators.required],
      consigneeAddress: ['', Validators.required],
      consigneeState: [''],
      consigneeCountry: ['', Validators.required],
      oldCOReferenceNumber: ['', Validators.required],
      iecNumber: ['', Validators.required],
      preCarriageBy: ['', Validators.required],
      placeOfReceipt: ['', Validators.required],
      VesselOrFlightNo: ['', Validators.required],
      loadingPort: ['', Validators.required],
      dischargePort: ['', Validators.required],
      finalDestination: ['', Validators.required],
      iccCooCode: ['', Validators.required],
      iccCooCodeDate: ['', Validators.required],
      lcNumber: [''],
      lcNumberDate: [''],
      lcNumberDateExpiry: [''],
      invoiceNumber: ['', Validators.required],
      invoiceNumberDate: ['', Validators.required],
      orderNumber: [''],
      orderNumberDate: [''],
      netWeight: ['', Validators.required],
      grossWeight: ['', Validators.required],
      totalValue: ['', Validators.required],
      valueCurrency: [this.currencyArray[0]],
      termsAccepted: [false, Validators.required],
      isCOEndorseRequired: [true, Validators.required],
      goods:this.formBuilder.array([ this.createGoodsItem() ])
    });

    this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
    this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
    this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})
    this.mastersService.getConfig('companyConfig').subscribe(data => {
      if(data['status'] == "success"){
        this.companyConfig =  data['data'][0]['keyValue'];
      }
    });
   }

  callClear() {
    let today = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
    this.toDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    this.getCertificated('', this.fromDate, this.toDate, '1', '1');

  }

   get coForm() { return this.coRequestFormGroup.controls;}

   get coAmmendmentForm() { return this.coAmmendmentRequestFormGroup.controls;}

   get otpForm() { return this.coOTPFormGroup.controls;}

   
   createGoodsItem(): FormGroup {
    return this.formBuilder.group({
      containerNumber: '',
      numberOfPacking: '',
      typeOfPacking: '',
      goodsDescription: ''
    });
  }

  createInitialGoodsItem(good): FormGroup {
    return this.formBuilder.group({
      containerNumber: good.containerNumber,
      numberOfPacking: good.numberOfPacking,
      typeOfPacking: good.typeOfPacking,
      goodsDescription: good.goodsDescription
    });
  }

  addGoodsItem(): void {
    this.items = this.coRequestFormGroup.get('goods') as FormArray;
    this.items.push(this.createGoodsItem());
  }

  addGoodsItemAmendment(): void {
    this.items = this.coAmmendmentRequestFormGroup.get('goods') as FormArray;
    this.items.push(this.createGoodsItem());
  }

  removeGoodsItem(index): void {
    this.items = this.coRequestFormGroup.get('goods') as FormArray;
    if(this.items.length > 1){
      this.items.removeAt(index);
    }
  }

  removeUploadDocsItem(index): void {
    if(this.attachedDocuments.length > 3){
      this.attachedDocuments.splice(index, 1);
    }
  }

  addAdditionalDocument(){
    this.attachedDocuments.push({name: '', isEndorseRequired: false});
  }
   
  onFileChange(event) {
    this.progressPer1 = 0;
    const reader = new FileReader();

    let interval1 = setInterval(() => {
      if(this.progressPer1 < 100){
        let progress = this.progressPer1
        this.progressPer1 = progress + 5
      }else{
        clearInterval(interval1);
      }
      
    }, 100)
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc = reader.result as string;

      };
   
    }
  }
  onFileChange2(event) {
    this.progressPer2 = 0;

    const reader = new FileReader();
    let interval2 = setInterval(() => {
      if(this.progressPer2 < 100){
        let progress = this.progressPer2
        this.progressPer2 = progress + 5
      }else{
        clearInterval(interval2);
      }
      
    }, 100)
    
    if(event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.imageSrc2 = reader.result as string;  
   
      };
   
    }
  }
   
  getCertificated(companyName: String, startDate:String, endDate: String, page: any, page1:any){

      if(this.currentUser && this.currentUser["role"] == UserRole.BA){
        this.loadingService.show();
        this.certificateService.getCertificates(companyName, startDate,endDate, 'plList', page).subscribe(data => {
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
            this.loadingService.hide();
            this.page = this.pagination['currentPage'];
            this.plList = data['data']['certificates'];
          }

        });
        this.loadingService.show();
        this.certificateService.getCertificates(companyName, startDate,endDate, 'coList', page1).subscribe(data => {
          if(data['status'] == "success"){
            this.pagination1 = data['data']['pagination'];
            if(!this.pagination1){
              this.pagination1 = {
                currentPage: 1,
                nextPage: 1,
                numOfResults: 0,
                pages: 1,
                perPage: 5
              };
            }
            this.loadingService.hide();
            this.page1 = this.pagination1['currentPage'];
            this.coList = data['data']['certificates'];
          }

        });
      }
      if(this.currentUser && (this.currentUser["role"] == UserRole.ICC_ADMIN|| this.currentUser["role"] == UserRole.ICC_EDITOR ) ){
        this.loadingService.show();
        this.certificateService.getEditorCertificates(companyName, startDate,endDate,'plList', page).subscribe(data => {
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
            this.loadingService.hide();
            this.page = this.pagination['currentPage'];
            this.plList = data['data']['certificates'];
            // this.coList = _.filter(data['data']['certificates'], (cert) => { return cert.docStatus == 'issued' });
          }

        });
        this.loadingService.show();
        this.certificateService.getEditorCertificates(companyName, startDate,endDate,'coList', page1).subscribe(data => {
          if(data['status'] == "success"){
            this.pagination1 = data['data']['pagination'];
            if(!this.pagination1){
              this.pagination1 = {
                currentPage: 1,
                nextPage: 1,
                numOfResults: 0,
                pages: 1,
                perPage: 5
              };
            }
            this.loadingService.hide();
            this.page1 = this.pagination1['currentPage'];
            this.coList = data['data']['certificates'];
          }

        });
      }
  }

  pageChanged(event: any): void {
    if (event && !isNaN(event) && event != this.pagination.currentPage) {
    this.getCertificated(this.searchText, this.fromDate, this.toDate, event, this.page1)
    }
  }
  pageChanged1(event: any): void {
    if (event && !isNaN(event) && event != this.pagination1.currentPage) {
    this.getCertificated(this.searchText, this.fromDate, this.toDate,this.page, event)
    }
  }


  onEditCertificateClicked(certificate){
    this.certificateMode = 'edit';
    this.ammendmentMode = 'edit';
    this.payClicked = false;

    this.certificateId = certificate._id;
    this.loadingService.show();
    this.certificateService.getCertificateByID(certificate._id).subscribe(data => {
      this.loadingService.hide();
      if(data['status'] == "success"){
        this.currentCertificate = data['data'];

        if(this.currentCertificate['docStatus'] != "draft" && !this.currentCertificate['rejectionReason']){

          this.toastr.error('', "Request is not in draft mode");
          document.getElementById("closeCreateCoModelCloseButton").click();
          this.getCertificated('', this.fromDate, this.toDate, '1', '1');

          return false;

        }
        this.coRequestFormGroup = this.formBuilder.group({
          // email: ['', Validators.pattern(EmailPattern)],
          exporter: [this.currentCertificate.exporter , Validators.required],
          exporterAddress: [this.currentCertificate.exporterAddress , Validators.required],
          isNotifiedParty: [this.currentCertificate.isNotifiedParty || false],
          partyName: [this.currentCertificate.partyName || ''],
          partyAddress: [this.currentCertificate.partyAddress || ''],
          partyState: [this.currentCertificate.partyState || ''],
          partyCountry: [this.currentCertificate.partyCountry || ''],
          exporterState: [this.currentCertificate.exporterState, Validators.required],
          exporterCountry: [this.currentCertificate.exporterCountry, Validators.required],
          consignee: [this.currentCertificate.consignee, Validators.required],
          consigneeAddress: [this.currentCertificate.consigneeAddress, Validators.required],
          consigneeState: [this.currentCertificate.consigneeState],
          consigneeCountry: [this.currentCertificate.consigneeCountry, Validators.required],
          iecNumber: [this.currentCertificate.iecNumber, Validators.required],
          preCarriageBy: [this.currentCertificate.preCarriageBy, Validators.required],
          placeOfReceipt: [this.currentCertificate.placeOfReceipt, Validators.required],
          VesselOrFlightNo: [this.currentCertificate.VesselOrFlightNo, Validators.required],
          loadingPort: [this.currentCertificate.loadingPort, Validators.required],
          dischargePort: [this.currentCertificate.dischargePort, Validators.required],
          finalDestination: [this.currentCertificate.finalDestination, Validators.required],
          iccCooCode: [this.currentCertificate.iccCooCode, Validators.required],
          iccCooCodeDate: [this.currentCertificate.iccCooCodeDate, Validators.required],
          lcNumber: [this.currentCertificate.lcNumber],
          lcNumberDate: [this.currentCertificate.lcNumberDate],
          lcNumberDateExpiry: [this.currentCertificate.lcNumberDateExpiry],
          invoiceNumber: [this.currentCertificate.invoiceNumber, Validators.required],
          invoiceNumberDate: [this.currentCertificate.invoiceNumberDate, Validators.required],
          orderNumber: [this.currentCertificate.orderNumber],
          orderNumberDate: [this.currentCertificate.orderNumberDate],
          netWeight: [this.currentCertificate.netWeight, Validators.required],
          grossWeight: [this.currentCertificate.grossWeight, Validators.required],
          totalValue: [this.currentCertificate.totalValue, Validators.required],
          valueCurrency: [this.currentCertificate.valueCurrency || this.currencyArray[0]],
          termsAccepted: [this.currentCertificate.termsAccepted, Validators.required],
          isCOEndorseRequired: [this.currentCertificate.isCOEndorseRequired, Validators.required],
          goods:this.formBuilder.array([])
        
        });

        this.items = this.coRequestFormGroup.get('goods') as FormArray;
        _.forEach(this.currentCertificate.goods, (good) => {
          this.items.push(this.createInitialGoodsItem(good));
        })

        if(this.currentCertificate.invoice && this.currentCertificate.invoice.length> 0){
          let lastInvoice = this.currentCertificate.invoice[ this.currentCertificate.invoice.length -1];
          if(lastInvoice ) {
            this.loadingService.show();
            this.certificateService.getInvoiceById(lastInvoice.invoiceId).subscribe(data=> {
              this.loadingService.hide();
              this.currentInvoice = data['data'];
              
            });
          }
        }
        this.attachedDocuments = [];

        if( this.currentCertificate.attachedDocuments.length > 0){
          _.forEach(this.currentCertificate.attachedDocuments, (doc) => {
            this.attachedDocuments.push({name: doc.name, isEndorseRequired: doc.isEndorseRequired, url: doc.url})
          });
        }else{
          this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
          this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
          this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})
      }
      }
      });
    
  }

  onEditAmmendmentCertificateClicked(certificate){
    this.certificateMode = 'edit';
    this.ammendmentMode = 'edit';
    this.ammntmentRequest = true;
    this.payClicked = false;
    this.certificateId = certificate._id;

    this.loadingService.show();
    this.certificateService.getCertificateByID(certificate._id).subscribe(data => {
      this.loadingService.hide();
      if(data['status'] == "success"){
        this.currentCertificate = data['data'];
        if(this.currentCertificate['docStatus'] != "draft"){

          this.toastr.error('', "Request is not in draft mode");
          document.getElementById("closeCreateCoModelCloseButton").click();
          this.getCertificated('', this.fromDate, this.toDate, '1', '1');

          return false;

        }
        this.coAmmendmentRequestFormGroup = this.formBuilder.group({
          // email: ['', Validators.pattern(EmailPattern)],
          exporter: [this.currentCertificate.exporter , Validators.required],
          exporterAddress: [this.currentCertificate.exporterAddress , Validators.required],
          isNotifiedParty: [this.currentCertificate.isNotifiedParty || false],
          partyName: [this.currentCertificate.partyName || ''],
          partyAddress: [this.currentCertificate.partyAddress || ''],
          partyState: [this.currentCertificate.partyState || ''],
          partyCountry: [this.currentCertificate.partyCountry || ''],
          exporterState: [this.currentCertificate.exporterState, Validators.required],
          exporterCountry: [this.currentCertificate.exporterCountry, Validators.required],
          consignee: [this.currentCertificate.consignee, Validators.required],
          consigneeAddress: [this.currentCertificate.consigneeAddress, Validators.required],
          consigneeState: [this.currentCertificate.consigneeState],
          consigneeCountry: [this.currentCertificate.consigneeCountry, Validators.required],
          iecNumber: [this.currentCertificate.iecNumber, Validators.required],
          oldCOReferenceNumber: [this.currentCertificate.oldCOReferenceNumber, Validators.required],
          preCarriageBy: [this.currentCertificate.preCarriageBy, Validators.required],
          placeOfReceipt: [this.currentCertificate.placeOfReceipt, Validators.required],
          VesselOrFlightNo: [this.currentCertificate.VesselOrFlightNo, Validators.required],
          loadingPort: [this.currentCertificate.loadingPort, Validators.required],
          dischargePort: [this.currentCertificate.dischargePort, Validators.required],
          finalDestination: [this.currentCertificate.finalDestination, Validators.required],
          iccCooCode: [this.currentCertificate.iccCooCode, Validators.required],
          iccCooCodeDate: [this.currentCertificate.iccCooCodeDate, Validators.required],
          lcNumber: [this.currentCertificate.lcNumber],
          lcNumberDate: [this.currentCertificate.lcNumberDate],
          lcNumberDateExpiry:[this.currentCertificate.lcNumberDateExpiry],
          invoiceNumber: [this.currentCertificate.invoiceNumber, Validators.required],
          invoiceNumberDate: [this.currentCertificate.invoiceNumberDate, Validators.required],
          orderNumber: [this.currentCertificate.orderNumber],
          orderNumberDate: [this.currentCertificate.orderNumberDate],
          netWeight: [this.currentCertificate.netWeight, Validators.required],
          grossWeight: [this.currentCertificate.grossWeight, Validators.required],
          totalValue: [this.currentCertificate.totalValue, Validators.required],
          valueCurrency: [this.currentCertificate.valueCurrency || this.currencyArray[0]],
          termsAccepted: [this.currentCertificate.termsAccepted, Validators.required],
          isCOEndorseRequired: [this.currentCertificate.isCOEndorseRequired, Validators.required],
          goods:this.formBuilder.array([])
        
        });

        this.items = this.coAmmendmentRequestFormGroup.get('goods') as FormArray;
        _.forEach(this.currentCertificate.goods, (good) => {
          this.items.push(this.createInitialGoodsItem(good));
        })

        if(this.currentCertificate.invoice && this.currentCertificate.invoice.length> 0){
          let lastInvoice = this.currentCertificate.invoice[ this.currentCertificate.invoice.length -1];
          if(lastInvoice ) {
            this.loadingService.show();
            this.certificateService.getInvoiceById(lastInvoice.invoiceId).subscribe(data=> {
              this.loadingService.hide();
              this.currentInvoice = data['data'];
              
            });
          }
        }
        this.attachedDocuments = [];

        if( this.currentCertificate.attachedDocuments.length > 0){
          _.forEach(this.currentCertificate.attachedDocuments, (doc) => {
            this.attachedDocuments.push({name: doc.name, isEndorseRequired: doc.isEndorseRequired, url: doc.url})
          });
        }else{
          this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})
        }
      }
      });
    
  }

  checkReferenceNumber(){
    this.notIssuedCertificate = false;
    this.coRefCertInvalid = false
    let values = this.coAmmendmentRequestFormGroup.value;
    if(values.oldCOReferenceNumber && values.oldCOReferenceNumber != ''){
      this.loadingService.show();
      this.certificateService.getCertificateByReference(values.oldCOReferenceNumber).subscribe(data => {
        this.loadingService.hide();
        if(_.isEmpty(data['data'])){ 
          this.coRefCertInvalid = true;
          return false;
        }
        
        if(data['status'] == 'success' && !_.isEmpty(data['data'])){

         
          let oldCert = data['data'];
          if(oldCert['docStatus'] == 'issued'){

          this.coAmmendmentRequestFormGroup = this.formBuilder.group({
            // email: ['', Validators.pattern(EmailPattern)],
            exporter: [oldCert.exporter , Validators.required],
            exporterAddress: [oldCert.exporterAddress , Validators.required],
            isNotifiedParty: [oldCert.isNotifiedParty || false],
            partyName: [oldCert.partyName || ''],
            partyAddress: [oldCert.partyAddress || ''],
            partyState: [oldCert.partyState || ''],
            partyCountry: [oldCert.partyCountry || ''],
            exporterState: [oldCert.exporterState, Validators.required],
            exporterCountry: [oldCert.exporterCountry, Validators.required],
            consignee: [oldCert.consignee, Validators.required],
            consigneeAddress: [oldCert.consigneeAddress, Validators.required],
            consigneeState: [oldCert.consigneeState],
            consigneeCountry: [oldCert.consigneeCountry, Validators.required],
            iecNumber: [oldCert.iecNumber, Validators.required],
            oldCOReferenceNumber: [values.oldCOReferenceNumber, Validators.required],
            preCarriageBy: [oldCert.preCarriageBy, Validators.required],
            placeOfReceipt: [oldCert.placeOfReceipt, Validators.required],
            VesselOrFlightNo: [oldCert.VesselOrFlightNo, Validators.required],
            loadingPort: [oldCert.loadingPort, Validators.required],
            dischargePort: [oldCert.dischargePort, Validators.required],
            finalDestination: [oldCert.finalDestination, Validators.required],
            iccCooCode: [oldCert.iccCooCode, Validators.required],
            iccCooCodeDate: [oldCert.iccCooCodeDate, Validators.required],
            lcNumber: [oldCert.lcNumber],
            lcNumberDate: [oldCert.lcNumberDate],
            lcNumberDateExpiry:[oldCert.lcNumberDateExpiry],

            invoiceNumber: [oldCert.invoiceNumber, Validators.required],
            invoiceNumberDate: [oldCert.invoiceNumberDate, Validators.required],
            orderNumber: [oldCert.orderNumber, Validators.required],
            orderNumberDate: [oldCert.orderNumberDate, Validators.required],
            netWeight: [oldCert.netWeight, Validators.required],
            grossWeight: [oldCert.grossWeight, Validators.required],
            totalValue: [oldCert.totalValue, Validators.required],
            valueCurrency: [oldCert.valueCurrency || this.currencyArray[0]],
            termsAccepted: [oldCert.termsAccepted, Validators.required],
            isCOEndorseRequired: [oldCert.isCOEndorseRequired, Validators.required],
            goods:this.formBuilder.array([])
          
          });
  
          this.items = this.coAmmendmentRequestFormGroup.get('goods') as FormArray;
          _.forEach(oldCert.goods, (good) => {
            this.items.push(this.createInitialGoodsItem(good));
          })
        }else{
          this.notIssuedCertificate = true;
        }
        }
      })
    }
  }

  updateFilter(searchText: String, startDate: String, endDate: String): void {

    this.getCertificated(searchText, startDate, endDate, '1', '1');

  }


  onCertificateDelete(event,certificate){
    event.preventDefault()

    this.currentCertificate = certificate;
  }

  onAmmendmentRequestCOSubmit(){
    this.coAmmendmentRequestSubmitted = true;
    this.showError = '';
    if(this.notIssuedCertificate || this.coRefCertInvalid ){
      this.showError ="CO Reference Number: is invalid or not issued."
      return;
    }
    if(this.coAmmendmentRequestFormGroup.invalid){
      return false;
    }
    let values = this.coAmmendmentRequestFormGroup.value;
    if(!values.termsAccepted){
      this.showError = "Terms and Conditions: Request you to go throw Terms and Conditions and accept them to proceed."
      return false;
    }
    if(!values.lcNumber && !values.orderNumber){
      this.showError = "Please Enter LC Number or Order Number and dates associated."
      return false;
    }
    if(values.lcNumber && (!values.lcNumberDateExpiry || !values.lcNumberDateExpiry)){
      this.showError = "Please Enter LC Number Date and Expiry Date."
      return false;
    }

    if(values.orderNumber && !values.orderNumberDate ){
      this.showError = "Please Enter Order Number Date."
      return false;
    }
    if(values.goods && values.goods.length > 0){
      let isMissingValues = false;
      _.forEach(values.goods, (good) => { _.values(good).some( (x) => { if(x == undefined || x == '') isMissingValues = true; }  )});

      if(isMissingValues){
        this.showError ="Goods Details: All values are required";
        return false;
      }

    }
    values.email = this.currentUser["email"];
    values.ammendmentMode = true;
    // this.loadingService.show();
    if(this.createPlModal == 'edit' || !_.isEmpty(this.currentCertificate) ){
      // edit mode activated
      this.loadingService.show();
      this.certificateService.editCertificate(values, this.currentCertificate._id).subscribe(data => {
        this.loadingService.hide();
        if(data['status'] == "success"){
          this.getCertificated('','','', 1, 1);
          this.page = 1;
          this.currentCertificate = data['data'];
          this.coAmmendmentRequestSubmitted = false;
          document.getElementById("firstStepNextAmmendment").click();
          this.toastr.success('Success', 'Draft Certificate updated successfully...');
        }else{
          this.toastr.error('',data['message'] );
        }
        
      });
    }else{
      this.loadingService.show();
      this.certificateService.createCertificate(values).subscribe(data => {
        this.loadingService.hide();
        if(data['status'] == "success"){
          this.getCertificated('','','', 1, 1);
          this.page = 1;
          this.currentCertificate = data['data'];
          this.coAmmendmentRequestSubmitted = false;

          if( this.currentCertificate.attachedDocuments.length > 0){
            _.forEach(this.currentCertificate.attachedDocuments, (doc) => {
              this.attachedDocuments.push({name: doc.name, isEndorseRequired: doc.isEndorseRequired, url: doc.url})
            });
          }else{
            this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})
          }

          document.getElementById("firstStepNextAmmendment").click();
          this.toastr.success('Success', 'Draft Certificate created successfully...');

        }else{
          this.toastr.error('',data['message'] );
        }
        
      });
    }

  }

  onCOSubmit(){
    this.coSubmitted = true;
    this.showError = '';
    if(this.coRequestFormGroup.invalid){
      return false;
    }
    let values = this.coRequestFormGroup.value;
    if(!values.termsAccepted){
      this.showError = "Terms and Conditions: Request you to go throw Terms and Conditions and accept them to proceed."
      return false;
    }
    if(!values.lcNumber && !values.orderNumber){
      this.showError = "Please Enter LC Number or Order Number and dates associated."
      return false;
    }
    if(values.lcNumber && (!values.lcNumberDateExpiry || !values.lcNumberDateExpiry)){
      this.showError = "Please Enter LC Number Date and Expiry Date."
      return false;
    }

    if(values.orderNumber && !values.orderNumberDate ){
      this.showError = "Please Enter Order Number Date."
      return false;
    }

    if(values.goods && values.goods.length > 0){
      let isMissingValues = false;
      _.forEach(values.goods, (good) => { _.values(good).some( (x) => { if(x == undefined || x == '') isMissingValues = true; }  )});

      if(isMissingValues){
        this.showError ="Goods Details: All values are required";
        return false;
      }

    }
    values.email = this.currentUser["email"];
    // this.loadingService.show();
    if(this.createPlModal == 'edit' || !_.isEmpty(this.currentCertificate) ){
      // edit mode activated
      this.loadingService.show();
      this.certificateService.editCertificate(values, this.currentCertificate._id).subscribe(data => {
        this.loadingService.hide();
        if(data['status'] == "success"){
          this.getCertificated('','','', 1, 1);
          this.page = 1;
          this.currentCertificate = data['data'];
          this.coSubmitted = false;
          this.loadingService.hide();
          document.getElementById("firstStepNext").click();
          this.toastr.success('Success', 'Draft Certificate updated successfully...');
        }else{
          this.toastr.error('',data['message'] );
        }
        
      });
    }else{
      this.loadingService.show();
      this.certificateService.createCertificate(values).subscribe(data => {
        this.loadingService.hide();
        if(data['status'] == "success"){
          this.getCertificated('','','', 1, 1);
          this.page = 1;
          this.currentCertificate = data['data'];
          this.coSubmitted = false;
          this.loadingService.hide();
          this.attachedDocuments = [];

          if( this.currentCertificate.attachedDocuments.length > 0){
            _.forEach(this.currentCertificate.attachedDocuments, (doc) => {
              this.attachedDocuments.push({name: doc.name, isEndorseRequired: doc.isEndorseRequired, url: doc.url})
            });
          }else{
            this.attachedDocuments.push({name: "Packing List", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Commercial Invoice", isEndorseRequired: false})
            this.attachedDocuments.push({name: "Letter of Credit", isEndorseRequired: false})
          }
          document.getElementById("firstStepNext").click();
          this.toastr.success('Success', 'Draft Certificate created successfully...');

        }else{
          this.toastr.error('',data['message'] );
        }
        
      });
    }

  }

  clearModel(){
    // this.coRequestFormGroup.reset();
   this.cORequestInitial();
    // this.coAmmendmentRequestFormGroup.reset();
    this.coAmmendmentInitital();
    this.currentCertificate = {};
    this.emailSubmitted = false;
    this.minLCDate = moment();
    this.coAmmendmentRequestSubmitted = false;
    this.attachedDocuments = [];
    this.certificateId = '';
    this.enteredOTP = '';
    this.ezPayURL = '';
    document.getElementById('resetStepper').click();
    this.coSubmitted = false;
    this.ammntmentRequest = false;
    this.coAmmendmentRequestSubmitted = false;
    this.coAmmendmentRequestSubmitted = false;
    this.emailSubmitted = false;
    this.notIssuedCertificate = false;
    this.coRefCertInvalid = false;

  }

  resetStepper(stepper: MatStepper){
    stepper.selectedIndex = 0;
 }
 

  onDocUploadClicked(event, index): void {
    event.preventDefault()
    let id = "certificateDocInput-" + index;
    document.getElementById(id).click();

  }

  onFileChosen(event, doc, i): void {
    let reader = new FileReader()

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]

      doc.file = file;
      reader.readAsDataURL(file)

      reader.onload = () => {
        //this.createEventForm.controls['eventImage'].setValue(file)
        doc.preview = reader.result
      }

      // need to run CD since file load runs outside of zone
    }
  }
  getFileSmallName(url){
    if(url){
      return url.substring(url.lastIndexOf('/'))

    }
  }

  saveFileDocument =  (formData, id) => {
    this.loadingService.show();
    this.certificateService.uploadCertificateDocuments(formData, id).subscribe(data => {
      this.loadingService.hide();
      if(data['status'] == "success"){

          let updatedDoc = data['data']; 
          //replace the doc
            var i = _.findIndex(this.attachedDocuments, (doc) => {  return doc.name.toLowerCase() == updatedDoc.name.toLowerCase()});
            if(i !== -1){
              // Replace item at index using native splice
              this.attachedDocuments.splice(i, 1, updatedDoc);
            }

            let fileWithURL = 0;

            _.forEach(this.attachedDocuments, (doc)=> { if(doc.url && doc.url != '') fileWithURL++ })

            if(fileWithURL == this.attachedDocuments.length){
              this.loadingService.show();
              this.certificateService.saveCertificateDocuments({attachedDocuments:this.attachedDocuments } , this.currentCertificate._id).subscribe(data => {
  
      
                if(data['status'] == "success"){
                  this.currentCertificate = data['data'];
                  this.attachedDocuments = data['data']['attachedDocuments'];
                  this.onEditCertificateClicked(this.currentCertificate);
                  this.onEditAmmendmentCertificateClicked(this.currentCertificate)
                  this.loadingService.hide();
                  document.getElementById("secondStepNext").click();
                  this.uploadDocClicked = false;
      
                } 
              });
            }
        }
      });
  }

  checkAndSaveDocs() {
    this.showError = '';
    if(this.attachedDocuments.length < 3){
      this.showError= "Minimum 3 documents is Required to proceed.";
      return false;
    }
    

    if(this.attachedDocuments.length >= 2){
      
      let isFileEmpty = false;
      this.loadingService.show();
      _.forEach(this.attachedDocuments,  (doc)=> { 
          if( (!doc.file || doc.file == '')){ if(!doc.url) {isFileEmpty = true;}}
        });

      if(isFileEmpty){ this.showError= "Upload Doc:- File is Required to proceed."; return false;}
      else{
        this.uploadDocClicked = true;
        // Start Upload
        this.loadingService.show();
        let newDocuments = _.filter(this.attachedDocuments, (doc)=> {return doc.file });

        if(newDocuments.length > 0){
          // upload the document 
          // let index = 0;
          // for (let doc of necheckAndSaveDocswDocuments) {
          _.forEach(newDocuments, async (doc, index)=> {
            // Upload Document One By One
            doc.certificateID = this.currentCertificate._id;
              const formData = new FormData()
              //formData.append('file', this.eventImageFile)
                formData.append('file', doc.file)
                formData.append('name', doc.name)
                formData.append('isEndorseRequired', doc.isEndorseRequired)
                formData.append('certificateID', this.currentCertificate._id)
                 
                setTimeout(() => { this.saveFileDocument(formData, this.currentCertificate._id);}, index* 700);

                if(index +1 == newDocuments.length){
                  setTimeout(() => {  this.resendOTP(this.currentCertificate);}, index* 1000);
                }
                  
             
              });
            }else{
 
              // only save other values not uploading document
              this.loadingService.show();
              this.certificateService.saveCertificateDocuments({attachedDocuments:this.attachedDocuments } , this.currentCertificate._id).subscribe(data => {
  
                if(data['status'] == "success"){
                  this.currentCertificate = data['data'];
                  if(!this.currentCertificate.isOTPVerified){
                    this.resendOTP(this.currentCertificate);
                  }
                  this.attachedDocuments = data['data']['attachedDocuments'];
                  this.onEditCertificateClicked(this.currentCertificate);
                  this.onEditAmmendmentCertificateClicked(this.currentCertificate)
                  this.loadingService.hide();
                  document.getElementById("secondStepNext").click();
                  this.loadingService.hide();
                  this.uploadDocClicked = false;
                } 
              });
            }
        }
      }else{
        this.loadingService.show();
        this.certificateService.saveCertificateDocuments({attachedDocuments:this.attachedDocuments } , this.currentCertificate._id).subscribe(data => {
          if(data['status'] == "success"){
            this.currentCertificate = data['data'];
            this.attachedDocuments = data['data']['attachedDocuments'];
            this.onEditCertificateClicked(this.currentCertificate);
            this.onEditAmmendmentCertificateClicked(this.currentCertificate);
            this.loadingService.hide();
            document.getElementById("secondStepNext").click();
            this.uploadDocClicked = false;


          } 
        });
      }
  }

  

  backButtonSecondStep(){
    if(this.currentCertificate.ammendmentMode){
      this.ammntmentRequest = true
    }else{
      this.ammntmentRequest = false;

    }
  }

  resendOTP =(certificate)=>{
    this.loadingService.show();
    this.certificateService.requestOTP(certificate.email, this.currentCertificate._id).subscribe(data => {
      this.loadingService.hide();
      if(data['status'] == "success"){
        this.toastr.success('Success', 'OTP Send successfully...');
      }else if(data['status'] == "error"){
        this.toastr.error('', data["message"]);

      }
    });
  }
   

  verifyOTP = (otp) => {
    this.showError
    if(!otp){
      this.showError = "Please enter OTP";
    }else{
      this.loadingService.show();
      this.certificateService.verifyOTP(otp , this.currentCertificate._id).subscribe(data => {
        if(data['status'] == "success"){
          this.enteredOTP = '';
          this.onEditCertificateClicked(this.currentCertificate);
          this.onEditAmmendmentCertificateClicked(this.currentCertificate)

          this.generateInvoice(this.currentCertificate);
          setTimeout(() => {
            this.loadingService.hide();
            document.getElementById("thirdStepNext").click();
          }, 700);

          // document.getElementById("thirdStepNext").click();
          
        }
        if(data['status'] == "error"){
          this.loadingService.hide();
          this.showError = data['message'];
        }
      });
    }

  }
  lcDateChanged = (data) =>{
    this.minLCDate = data;
  }


  getCert = () => {
    // this.certificateService.getCertificateByID(this.certificateId).subscribe(data => {
    
    //   if(data['status'] == "success"){
    //     this.currentCertificate = data['data'];
    //   }
    // });
    this.payClicked = false;

    let coReferenceNumber = this.currentCertificate.coReferenceNumber.substring(this.currentCertificate.coReferenceNumber.indexOf('/') +1 , this.currentCertificate.coReferenceNumber.indexOf('/') + 5) +this.currentCertificate.coReferenceNumber.substring(this.currentCertificate.coReferenceNumber.lastIndexOf('/') +1) 
    let coReferenceNumberReal = this.currentCertificate.coReferenceNumber + '-' + this.currentCertificate.generatedOTP;
    let subId = this.currentUser['isMember'] ?  (this.ammntmentRequest ? ezPAY.ammMemberSubId : ezPAY.newMemeberSubId) : (this.ammntmentRequest ? ezPAY.ammNonMemberSubId : ezPAY.newNonMemberSubId) ;
    let totalAmount = this.currentInvoice.totalAmount.toString();
    let companyName = this.currentCertificate.exporter.toString();
    // document.getElementById("closeCreateCoModelCloseButton").click();
    let mandatoryFields = coReferenceNumberReal.toString() + '|' + subId.toString() + '|' + totalAmount.toString()  + '|1' ;
  
    this.payment = {
      "merchantid": ezPAY.ICID.toString().trim(),
      "mandatory fields":this.encryptText(mandatoryFields),
      "optional fields": this.encryptText('a|a|a|a|a|0|a|a'),
      "returnurl": this.encryptText('http://api.fdpconnect.com/api/v1/payment/returnurl'),
      "Reference No": this.encryptText(coReferenceNumberReal.toString()),
      "submerchantid": this.encryptText(subId.toString()),
      "transaction amount": this.encryptText(totalAmount.toString()),
      "paymode": this.encryptText('9')
    }
    let ezPayUrlWithoutEncoding = "https://eazypay.icicibank.com/EazyPG?merchantid="+ezPAY.ICID +"&mandatory%20fields=" + coReferenceNumber+ '|' + subId + '|' + totalAmount  + '|' + companyName + "&optional%20fields= 20|20|20|20 " + "&returnurl="+ 'http://api.fdpconnect.com/api/v1/payment/returnurl' +"&Reference%20No="+ coReferenceNumber+"&submerchantid="+ subId.toString() +"&transaction%20amount=" + totalAmount.toString()  +"&paymode=" + '9';
    let ezPayURL = "https://eazypay.icicibank.com/EazyPG?merchantid="+ezPAY.ICID +"&mandatory%20fields=" + this.encryptText(coReferenceNumber+ '|' + subId + '|' + totalAmount  + '|' + companyName) + "&optional%20fields= " + this.encryptText(" | | | ") +"&returnurl="+ this.encryptText('http://api.fdpconnect.com/api/v1/payment/returnurl') +"&Reference%20No="+ this.encryptText(coReferenceNumber) +"&submerchantid="+ this.encryptText(subId.toString()) +"&transaction%20amount=" + this.encryptText(totalAmount.toString())  +"&paymode=" + this.encryptText('9');
    // ezPayURL = ezPayURL.replace(/\s/g, '%20');
    
  }

  fixDecimal = (value) =>{
    let num = parseFloat(value).toFixed(2);
    return parseFloat(num);
  }

  generateInvoice = (certificate) => {
    this.loadingService.show();
    this.certificateService.getCertificateByID(certificate._id).subscribe(data => {
      this.loadingService.hide();
        if(data['status'] == "success"){
          this.currentCertificate = data['data'];
        }
      this.loadingService.show();
    this.mastersService.getAllPricing().subscribe(data => {
      if(data['status'] == "success"){
        this.pricingList = data['data'];

        let today = new Date();
        // Create Invoice 
        let invoice = {
          invoiceDate: today.toISOString(),
          certificateId: this.currentCertificate._id,
          certificateRefNo: this.currentCertificate.coReferenceNumber,
          deliveryNote: '',
          suppliersRef: '',
          buyer: this.currentCertificate.exporter,
          buyerAddress: this.currentCertificate.exporterAddress,
          buyerState: this.currentCertificate.exporterState,
          buyerGSTINUIN: this.currentUser['gstinNumber'],
          buyerIEC:  this.currentUser['iecNumber'],
          buyerPAN: this.currentUser['panNumber'],
          buyerOrderNo: this.currentCertificate.orderNumber,
          dateOfBuyerOrder: this.currentCertificate.orderNumberDate ? new Date(this.currentCertificate.orderNumberDate).toISOString(): '',
          dispatchedDocumentNo: '',
          destination:this.currentCertificate.finalDestination,
          deliveryTerms: '',
          itemName: this.currentCertificate.ammendmentMode ? "Ammendment Certificate of Origin": "Certificate of Origin",
          invoiceItems:[],
          // payMode: {type: String,  required: true},
          taxDetails:[],
          // orgPanN0:{type: String}, add this on server
          invoicePaid: false,
          totalQuantity: 0,
          totalAmount: 0,
          totalAmountWords: '',
          totalTaxAmount: 0,
          taxAmount: 0,
          totalTaxableValue: 0,
          remark: ''
        }

        let isInterState = this.currentCertificate.exporterState.toLowerCase().indexOf('bengal') !== -1 ? false: true;

        if(this.currentCertificate.isCOEndorseRequired){
          let certificateCostObj = _.find(this.pricingList, function(price){ return price.internalName == 'isCOEndorseRequired'});

          let pricingCost =  parseFloat(this.currentUser['isMember'] ? certificateCostObj.costForMember : certificateCostObj.costForNonMember);
          invoice.invoiceItems.push({
            description: "CERTIFICATE OF ORIGIN FEES",
            hsnOrSAC: '998399',
            quantity: 1,
            rate: this.fixDecimal(isInterState? this.getIGSTRate(pricingCost): this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost)),
            amount: this.fixDecimal(isInterState? pricingCost - this.getIGSTRate(pricingCost): pricingCost - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost))),
          });

          invoice.totalAmount = this.fixDecimal( invoice.totalAmount + pricingCost); // Added total cost to 
          invoice.totalQuantity = invoice.totalQuantity + 1;
          invoice.remark = 'C.O Fees'

          invoice.taxDetails.push({
            hsnOrSAC: '998399',
            taxableValue:this.fixDecimal( isInterState ? pricingCost - this.getIGSTRate(pricingCost): pricingCost - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost))),
            taxRate: isInterState ?  this.companyConfig['igstRate'] + '%' :  parseFloat( (this.companyConfig['cgstRate']) + (this.companyConfig['sgstRate']) )  + '%',
            taxAmount:this.fixDecimal( isInterState ?  this.getIGSTRate(pricingCost) :   this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost)),
            totalTaxAmount: this.fixDecimal( isInterState ?  this.getIGSTRate(pricingCost): ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost))))
          })

          let taxNow = isInterState ?  (this.getIGSTRate(pricingCost)):  ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost)) );

          invoice.totalTaxAmount = this.fixDecimal(invoice.totalTaxAmount + taxNow);
          
        }
          _.forEach(this.currentCertificate.attachedDocuments, (doc)  => {

            if(doc['isEndorseRequired']){
              let isDocEndorseRequired = _.find(this.pricingList, function(price){ return price.internalName == 'isDocEndorseRequired'});

              let pricingCost = this.currentUser['isMember'] ? isDocEndorseRequired.costForMember : isDocEndorseRequired.costForNonMember;
              invoice.invoiceItems.push({
                description: doc.name + ' Certification FEES',
                hsnOrSAC: '',
                quantity: 1,
                rate: this.fixDecimal(isInterState? this.getIGSTRate(pricingCost): this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost)),
                amount:this.fixDecimal( isInterState? parseFloat(pricingCost) - this.getIGSTRate(pricingCost): parseFloat(pricingCost) - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost))),
              }); 
              invoice.totalAmount = invoice.totalAmount + parseFloat(pricingCost); // Added total cost to 
              invoice.totalQuantity = invoice.totalQuantity + 1;
              invoice.remark = invoice.remark == ''?  doc.name + ' Certification FEES':  invoice.remark + ', ' + doc.name + ' Certification FEES';

              invoice.taxDetails.push({
                hsnOrSAC: '998399',
                taxableValue: this.fixDecimal(isInterState ? pricingCost - this.getIGSTRate(pricingCost): pricingCost - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost))),
                taxRate: isInterState ?  this.companyConfig['igstRate'] + '%' :  parseFloat( (this.companyConfig['cgstRate']) + (this.companyConfig['sgstRate']) )  + '%',
                taxAmount: this.fixDecimal(isInterState ?  this.getIGSTRate(pricingCost) :   this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost)),
                totalTaxAmount: this.fixDecimal( isInterState ?  this.getIGSTRate(pricingCost): ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost))))
              })
    
              let taxNow = isInterState ?  (this.getIGSTRate(pricingCost)):  ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost)) );
    
              invoice.totalTaxAmount = this.fixDecimal(invoice.totalTaxAmount + taxNow);
            }
  
            
          });

          if(this.currentCertificate.ammendmentMode){
            let ammendmentMode = _.find(this.pricingList, function(price){ return price.internalName == 'ammendmentMode'});
  
            let pricingCost = this.currentUser['isMember'] ? ammendmentMode.costForMember : ammendmentMode.costForNonMember;
            invoice.invoiceItems.push({
              description: "Ammendments / Fresh Correction",
              hsnOrSAC: '',
              quantity: 1,
              rate: this.fixDecimal(isInterState? this.getIGSTRate(pricingCost): this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost) ),
              amount: this.fixDecimal(isInterState? parseFloat(pricingCost) - this.getIGSTRate(pricingCost): parseFloat(pricingCost) - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost))),
            });
  
            invoice.totalAmount = invoice.totalAmount + parseFloat(pricingCost); // Added total cost to 
            invoice.totalQuantity = invoice.totalQuantity + 1;

            invoice.remark = invoice.remark == ''?  ' Ammendments Fees': invoice.remark +', Ammendments Fees';

            invoice.taxDetails.push({
              hsnOrSAC: '998399',
              taxableValue: isInterState ? pricingCost - this.getIGSTRate(pricingCost): pricingCost - (this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost)),
              taxRate: isInterState ?  this.companyConfig['igstRate'] + '%' :  parseFloat( (this.companyConfig['cgstRate']) + (this.companyConfig['sgstRate']) )  + '%',
              taxAmount: isInterState ?  this.getIGSTRate(pricingCost) :   this.getCGSTRate(pricingCost) + this.getSGSTtRate(pricingCost),
              totalTaxAmount:  isInterState ?  this.getIGSTRate(pricingCost): ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost)))
            })
  
            let taxNow = isInterState ?  (this.getIGSTRate(pricingCost)):  ( (this.getCGSTRate(pricingCost)) + (this.getSGSTtRate(pricingCost)) );
  
            invoice.totalTaxAmount = invoice.totalTaxAmount + taxNow;
            
            
          }
          if(isInterState){
            invoice.invoiceItems.push({
              description: "IGST",
              hsnOrSAC: '',
              quantity: '',
              amount:  this.fixDecimal( this.getIGSTRate(invoice.totalAmount)),

            });

          }else{
            invoice.invoiceItems.push({
              description: "CGST",
              hsnOrSAC: '',
              quantity: '',
              amount:  this.fixDecimal( this.getCGSTRate(invoice.totalAmount)),

            });

            invoice.invoiceItems.push({
              description: "SGST",
              hsnOrSAC: '',
              quantity: '',
              amount:   this.fixDecimal(this.getSGSTtRate(invoice.totalAmount)),

            });

          }


          this.certificateService.createInvoice(invoice).subscribe(data => {
            // this.loadingService.hide();
            if(data['status'] == "success"){

              this.currentInvoice = data['data'];
              // Add this Invoice to Certificate 
              this.certificateService.addInvoiceToCertificate(this.currentCertificate._id , this.currentInvoice._id, this.currentInvoice.invoiceDate).subscribe(cert => {
                if(cert['status'] == "success"){

                  this.currentCertificate = cert['data'];
                  this.loadingService.hide();
                  this.getCert();
                }
              });


            }

          });
        
      }

  

    //         description: {type: String},
    //         hsnOrSAC: {type: String},
    //         quantity: {type: String},
    //         rate:{type: Number},
    //         amount:{type: Number},
    // totalQuantity: {type: String, required: true},
    // totalAmount:{type: Number, required: true},
    // totalAmountWords:  {type: String, required: true},

          // Tax details
          // hsnOrSAC: {type: String},
          // taxableValue:{type: Number},
          // taxRate:{type: Number},
          // taxAmount:{type: Number},
          // totalTaxAmount:{type: Number},
          // totalTaxAmount:{type: Number},
          // taxAmount:{type: Number},
          // totalTaxableValue:{type: Number},
          //        remark: {type: String},

    });
  });
  }

  getIGSTRate = (price:number)=>{
    let igstRate = this.companyConfig['igstRate'];
    return igstRate * price / 100;
  }

  getCGSTRate = (price: number) => {

    let cgstRate = this.companyConfig['cgstRate'];

    return cgstRate * (price) / 100;


  }

  getSGSTtRate = (price: number) => {

    let sgstRate = this.companyConfig['sgstRate'];

    return sgstRate * (price) / 100;


  }

  isWalletPayActive(){
    if(this.currentInvoice && this.currentInvoice.totalAmount < this.currentUser['credit']){

      return true
    }else{
      return false 
    }
  }
  resubmit = (currentCertificate) => {
        this.payNowTest(currentCertificate);    
  }


  payCredit = (currentCertificate) => {

    let debit = {
      companyName: currentCertificate.exporter,
      buyerName: currentCertificate.consignee,
      description: "Co Request Amount Deduction",
      type: "Debit",
      amount: this.currentInvoice.totalAmount,
      userId: this.currentUser['_id'],
    }
    this.loadingService.show();
    this.walletService.useCredit(debit).subscribe(data => {
      if(data['status'] == "success"){
          this.currentUser = data['data']['user'];
          sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
          this.loadingService.hide();
          this.payNowTest(currentCertificate);
      }
    });
    
  }

  payNowTest = (currentCertificate) => {
    this.currentCertificate = currentCertificate;
    this.loadingService.show();
    this.certificateService.payAmountClicked(this.currentInvoice._id,this.currentCertificate._id).subscribe(data => {
      if(data['status'] == "success"){
        this.getCertificated(this.searchText, this.fromDate, this.toDate, '1', '1');
        this.loadingService.hide();
        document.getElementById("closeCreateCoModelCloseButton").click();

      }
    });
  };

  payNow = (currentCertificate) => {
    // this.currentCertificate = currentCertificate;
    // this.certificateService.payAmountClicked(this.currentInvoice._id,this.currentCertificate._id).subscribe(data => {
    //   if(data['status'] == "success"){
    //     this.getCertificated(this.searchText, this.fromDate, this.toDate, '1', '1');
    //     document.getElementById("closeCreateCoModelCloseButton").click();

    //   }
    // });
    let coReferenceNumber = this.currentCertificate.coReferenceNumber.substring(this.currentCertificate.coReferenceNumber.indexOf('/') +1 , this.currentCertificate.coReferenceNumber.indexOf('/') + 5) +this.currentCertificate.coReferenceNumber.substring(this.currentCertificate.coReferenceNumber.lastIndexOf('/') +1) 
    let subId = this.currentUser['isMember'] ?  (this.ammntmentRequest ? ezPAY.ammMemberSubId : ezPAY.newMemeberSubId) : (this.ammntmentRequest ? ezPAY.ammNonMemberSubId : ezPAY.newNonMemberSubId) ;
    let totalAmount = this.currentInvoice.totalAmount;
    //  document.getElementById("payModelSubmit").click();
     this.payClicked = true;
    this.currentCertificate = currentCertificate;
    let companyName = this.currentCertificate.exporter
    let ezPayUrlWithoutEncoding = "https://eazypay.icicibank.com/EazyPG?merchantid="+ ezPAY.ICID +"&mandatory fields=" + coReferenceNumber+ '|' + subId + '|' + totalAmount + '|' + companyName + "&optional fields= 20|20|20|20 " +"&returnurl="+ 'http://api.fdpconnect.com/api/v1/payment/returnurl' +"&Reference No="+ coReferenceNumber+"&submerchantid="+ subId.toString() +"&transaction amount=" + totalAmount.toString()  +"&paymode=" + '9';
    let ezPayURL = "https://eazypay.icicibank.com/EazyPG?merchantid="+ ezPAY.ICID +"&mandatory fields=" + this.encryptText(coReferenceNumber+ '|' + subId + '|' + totalAmount) + "&optional fields=" + this.encryptText( "0|0|0|0") + "&returnurl="+ this.encryptText('http://api.fdpconnect.com/api/v1/payment/returnurl') +"&Reference No="+ this.encryptText(coReferenceNumber) +"&submerchantid="+ this.encryptText(subId.toString()) +"&transaction amount=" + this.encryptText(totalAmount.toString())  +"&paymode=" + this.encryptText('9');
    
    // this.openPDF(ezPayURL);
    
    document.getElementById("payModelSubmit").click();

    document.getElementById("closeCreateCoModelCloseButton").click();


    


  }
  downloadClicked = (certificate) => {
    this.currentCertificate = certificate
  }

  openPDF = (src)=>{
    document.getElementById("full")['href'] = src;
    document.getElementById("full").click();
  }


  encryptText(input) {
    const key =  2700061021701028;
    const inputParam = input;
    const parsedKey = CryptoJS.enc.Utf8.parse(key);
    const encrypted = CryptoJS.AES.encrypt(inputParam, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    const ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    // $("#encryptedText").text(ciphertext);
    this.ezPayURL = ciphertext;
    const decrypted = CryptoJS.AES.decrypt(ciphertext, parsedKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });

    return ciphertext;
    // $("#decryptedText").text(decrypted.toString(CryptoJS.enc.Utf8));
}

}
