import { Component, OnInit } from '@angular/core';
import { GeneralServiceService } from '../../services/general-service.service';
import {Router,ActivatedRoute} from "@angular/router";
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { CertificateService } from '../../services/certificate.service';
import { LoadingScreenService } from '../loader/services/loading-screen.service';
import { ToastrService } from 'ngx-toastr';
import _ from "lodash";
import  {pdf2base64} from  'pdf-to-base64';
import * as converter from 'xml-js';


@Component({
  selector: 'app-plci',
  templateUrl: './plci.component.html',
  styleUrls: ['./plci.component.css']
})

export class PlciComponent implements OnInit {

 
  
  certificateId: string;
  currentCertificate :object;
  plObject:object;
  user: Object;
  plId:String;
  showError: string ='';
  imageObject: Array<object> = [];  
  imageObject1: Array<object> = [];
  acceptDocuments: any[];
  showFlag: boolean = false;
  selectedImageIndex: number = -1;
  editorAction: string  = ''
  constructor( private generalServiceService : GeneralServiceService,
    private certificateService: CertificateService,
    private route: ActivatedRoute,
    private router:Router,
    private toastr: ToastrService,
    private loadingService: LoadingScreenService,
    ) { 
    var plId = this.route.snapshot.paramMap.get("id");
    this.plId = plId;

  }

  ngOnInit(): void {
    this.user = JSON.parse(sessionStorage.getItem('currentUser'));
    this.acceptDocuments = [];
    this.certificateId = this.route.snapshot.params.id;
    this.getCertificateById(this.certificateId)
    this.plObject = this.generalServiceService.getPlById(this.plId);

  }

  
  getCertificateById = (certificateId:string) => {
    this.loadingService.show()
    this.certificateService.getCertificateByID(certificateId).subscribe(response => {
      this.loadingService.hide()
      this.currentCertificate = response['data'];

      // this.currentCertificate['coUrl'] = this.currentCertificate['coUrl'] +  "&output=embed";

      // _.forEach(this.currentCertificate['attachedDocuments'], (doc) => {
      //     doc.url = doc.url +  "&output=embed";
      // })
      if(this.currentCertificate['isCOEndorseRequired']){
        this.acceptDocuments.push({
          name: "Certificate Of Origin",
        })
      }

      _.forEach(this.currentCertificate['attachedDocuments'], (doc) => {
        if(doc.isEndorseRequired){
          this.acceptDocuments.push({
            name: doc['name'].toUpperCase(),
          });
        }
      })
    }, error => {
      this.loadingService.hide()
      this.toastr.error(error.message, 'Error')
    })
  }

  showLightbox(index) {
    this.selectedImageIndex = index;
    this.showFlag = true;
}

closeEventHandler() {
  this.showFlag = false;
  this.selectedImageIndex = -1;
}

openPDF = (src)=>{
  document.getElementById("full")['href'] = src;
  document.getElementById("full").click();
}

rejectRequest = (rejectionReason) =>{
  this.showError = ''
  if(!rejectionReason || rejectionReason == ''){
    this.showError = "Reason is required";
    return false;
  }

  this.currentCertificate['docStatus'] = 'rejected';

  this.certificateService.rejectCertificate(this.currentCertificate).subscribe(response => {

    if(response['staus'] = 'success')
    this.currentCertificate = response['data'];
    document.getElementById('rejectionModelCLoseButton').click();
  })


}

editorAccepted (){
  this.editorAction = "Accept";

}

editorRejected(){
  
  this.editorAction = "Reject";

}

editorActionSubmit = (editorReason) => {
  this.showError = ''
  if(!editorReason || editorReason == ''){
    this.showError = "Reason is required";
    return false;
  }

  this.currentCertificate['editorAction'] = this.editorAction;

  this.certificateService.updateEditorAction(this.currentCertificate).subscribe(response => {

    if(response['staus'] = 'success')
    this.currentCertificate = response['data'];
    document.getElementById('editorActionModalCLoseButton').click();
  })



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

clearModel(){
  this.acceptDocuments = [];
  this.getCertificateById(this.certificateId);


}
onDocUploadClicked(event, index): void {
  event.preventDefault()
  let id = "certificateDocInput-" + index;
  document.getElementById(id).click();

}

checkAndSaveDocs() {
  this.showError = '';
  
    if(this.acceptDocuments.length >= 1){
      let isFileEmpty = false;
      _.forEach(this.acceptDocuments,  (doc)=> { 
          if( (!doc.file || doc.file == '')){ if(!doc.url) {isFileEmpty = true;}}
        });

      if(isFileEmpty){ this.showError= "Upload Doc:- File is Required to proceed."; return false;}
      else{
        // Start Upload
        this.loadingService.show();
        let newDocuments = _.filter(this.acceptDocuments, (doc)=> {return doc.file });

        if(newDocuments.length > 0){
          // upload the document 
          // let index = 0;
          // for (let doc of newDocuments) {
          _.forEach(newDocuments, async (doc, index)=> {
            // Upload Document One By One
            doc.certificateID = this.currentCertificate['_id'];
              const formData = new FormData()
              //formData.append('file', this.eventImageFile)
                formData.append('file', doc.file)
                formData.append('name', doc.name)
                formData.append('isEndorseRequired', doc.isEndorseRequired)
                formData.append('certificateID', this.currentCertificate['_id'])
                
                setTimeout(() => { 
                  if(doc.name == 'Certificate Of Origin'){
                    this.generateCO(formData, this.currentCertificate['_id']);
                  }else{
                    this.saveFileDocument(formData, this.currentCertificate['_id']);
                  }

                  if(index + 1 == newDocuments.length){

                    setTimeout(() => {
                      console.log('this.user', this.user);
                      let user = JSON.parse(sessionStorage.getItem('currentUser'));
                      console.log(user);
                      this.currentCertificate['issuedBy'] = user['firstName'] + ' ' + user['lastName'];
                      this.currentCertificate['issuedById'] = user['_id'];
                    this.certificateService.acceptCertificate(this.currentCertificate).subscribe(data => {

                      console.log('data', data);
                      this.getCertificateById(this.currentCertificate['_id']);
                      document.getElementById("acceptModelCloseButton").click();

                    });
                  }, 500);
                  }
                  }, index* 700);
            
              });
            
        }
      }
    }
}

generateCO = (formData, id) => {
  this.certificateService.uploadCOCertificateDocuments(formData, id).subscribe(data => {
    if(data['status'] == "success"){

        let updatedDoc = data['data']; 
    }
  });
}

saveFileDocument =  (formData, id) => {

  this.certificateService.uploadCertificateDocumentAndReplace(formData, id).subscribe(data => {
    if(data['status'] == "success"){

        let updatedDoc = data['data']; 
         
      }
    });
}

signDocHandel(i, doc){
  this.certificateService.getBase64Format(doc.url).subscribe(res =>{
    doc.base = res['data'];
    let today = new Date()
    let uniqueId = this.currentCertificate['_id'];
    uniqueId = uniqueId + '|' + doc.name;
    console.log('uniqueId', uniqueId);
    let body =  '<request>'+
        '<command>pkiNetworkSign</command>' + '<ts>'+ today.toISOString()  + '</ts>' + '<txn>'+ uniqueId +  '</txn>'+
        "<certificate>"+
          " <attribute name='CN'></attribute>"+
          " <attribute name='O'></attribute>"+
          "<attribute name='OU'></attribute>"+
          "<attribute name='T'></attribute>"+
          "<attribute name='E'></attribute>"+
          "<attribute name='SN'>‎‎</attribute>"+
          "<attribute name='CA'></attribute>"+
          "<attribute name='TC'>SG</attribute>"+
          "<attribute name='AP'>1</attribute>"+
          "</certificate>"+
          "<file>"+
            "<attribute name='type'>pdf</attribute>"+
          "</file>"+
          "<pdf>"+
          "<page>1</page>"+
          "<cood>10,10</cood>"+
          "<size>200,100</size>"+
          "</pdf>"+
          "<data>"+doc.base +"</data>"+
        '</request>';
      body.replace(/"/g, '+');
      this.certificateService.sendXMLToSign(body).subscribe(res=>{

      // convert xml to Json and send
      let result1 = converter.xml2json(res, {compact: true, spaces: 2});
      const JSONData = JSON.parse(result1);
        this.certificateService.uploadXMLSignedDocument(JSONData).subscribe(data=>{

          console.log('data', data);
          if(data['success']){
              this.getCertificateById(this.certificateId)  
          }

        },
        error => {
          this.toastr.error('',error.message);
        });
    
     

    })
  });

}

  digitalSigningDoc = () => {

    let documentsToSign = [];

    documentsToSign.push({name: "Certificate Of Origin", url:this.currentCertificate['coUrl'], base: ''});

    _.forEach(this.currentCertificate['attachedDocuments'], (doc)=> {
      if(doc.isEndorseRequired){
        documentsToSign.push({
          name:doc.name,
          url: doc.url,
          base: ''
        });
      }
    });

      if(documentsToSign.length > 0){
        let i = -1;
        console.log('documentsToSign', documentsToSign);
        documentsToSign.forEach( async doc => {
          // define synchronous anonymous function
          // IT WILL THROW ERROR!
          i++;
          console.log('i', i)
          if(i == documentsToSign.length -1){
            document.getElementById('acceptModelCloseButton').click();
            this.toastr.success('', "Signing Request sent successfully");
          }
          await this.signDocHandel(i, doc)
          console.log(i == documentsToSign.length-1);
          if(i == documentsToSign.length-1){
            setTimeout(()=> {
              console.log('this.user', this.user);
              this.currentCertificate['issuedBy'] = this.user['firstName'] + ' ' + this.user['lastName'];
              this.currentCertificate['issuedById'] = this.user['_id'];

              this.certificateService.acceptCertificate(this.currentCertificate).subscribe(data => {
  
                this.getCertificateById(this.currentCertificate['_id']);
                document.getElementById("acceptModelCloseButton").click();
  
              });
            }, i* 500);
          }
         
        })
      }
        // create Base64 of pdf
        // for(let i = 0; i<documentsToSign.length; i++){

        //   this.certificateService.getBase64Format(documentsToSign[i].url).subscribe(res =>{
        //     documentsToSign[i].base = res['data'];
        //     let today = new Date()
        //     let uniqueId = this.currentCertificate['_id'];
        //     uniqueId = uniqueId + '|' + documentsToSign[i].name;
        //     let body =  '<request>'+
        //         '<command>pkiNetworkSign</command>' + '<ts>'+ today.toISOString()  + '</ts>' + '<txn>'+ uniqueId +  '</txn>'+
        //         "<certificate>"+
        //           " <attribute name='CN'></attribute>"+
        //           " <attribute name='O'></attribute>"+
        //           "<attribute name='OU'></attribute>"+
        //           "<attribute name='T'></attribute>"+
        //           "<attribute name='E'></attribute>"+
        //           "<attribute name='SN'>‎‎</attribute>"+
        //           "<attribute name='CA'></attribute>"+
        //           "<attribute name='TC'>SG</attribute>"+
        //           "<attribute name='AP'>1</attribute>"+
        //           "</certificate>"+
        //           "<file>"+
        //             "<attribute name='type'>pdf</attribute>"+
        //           "</file>"+
        //           "<pdf>"+
        //           "<page>1</page>"+
        //           "<cood>10,10</cood>"+
        //           "<size>200,100</size>"+
        //           "</pdf>"+
        //           "<data>"+documentsToSign[i].base +"</data>"+
        //         '</request>';
        //       body.replace(/"/g, '+');
        //       this.certificateService.sendXMLToSign(body).subscribe(res=>{

        //       // convert xml to Json and send
        //       let result1 = converter.xml2json(res, {compact: true, spaces: 2});
        //       const JSONData = JSON.parse(result1);
        //         this.certificateService.uploadXMLSignedDocument(JSONData).subscribe(data=>{

        //           console.log('data', data);
        //           if(data['success']){
        //             if(i == documentsToSign.length -1){
        //               this.getCertificateById(this.certificateId)
        //             }
        //           }
  
        //         },
        //         error => {
        //           this.toastr.error('',error.message);
        //         });
            
             

        //     })


        //   }
        //     )
          
        // }
      // }

    

  }
  
  


}
