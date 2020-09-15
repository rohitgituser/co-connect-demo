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
import * as moment from 'moment';


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

      if(this.currentCertificate['editorActionTimeStamp']){
        this.currentCertificate['editorActionTimeStampMoment'] = moment(this.currentCertificate['editorActionTimeStamp']).format('LLL')
      }
      // this.currentCertificate['coUrl'] = this.currentCertificate['coUrl'] +  "&output=embed";

      // _.forEach(this.currentCertificate['attachedDocuments'], (doc) => {
      //     doc.url = doc.url +  "&output=embed";
      // })
      this.acceptDocuments = [];
      if(this.currentCertificate['isCOEndorseRequired']){
        let signedStatus = _.find(this.currentCertificate['signedDocument'] , doc=> {
          return doc.name == 'CO';
        })
        this.acceptDocuments.push({
          name: "Certificate Of Origin",
          oldUrl: this.currentCertificate['coUrl'],
          url: signedStatus && signedStatus.isSigned ? this.currentCertificate['coUrl'] : ''
        })
      }

      _.forEach(this.currentCertificate['attachedDocuments'], (doc) => {
        let signedStatus = _.find(this.currentCertificate['signedDocument'] , sign=> {
          
          return doc.name.toLowerCase() == sign.name.toLowerCase();
        })

        if(doc.isEndorseRequired){
          this.acceptDocuments.push({
            name: doc['name'].toUpperCase(),
            oldUrl: doc['url'],
            url: signedStatus && signedStatus.isSigned ? doc['url'] : ''

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
    if(this.currentCertificate['editorActionTimeStamp']){
      this.currentCertificate['editorActionTimeStampMoment'] = moment(this.currentCertificate['editorActionTimeStamp']).format('LLL')
    }
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
    if(this.currentCertificate['editorActionTimeStamp']){
      this.currentCertificate['editorActionTimeStampMoment'] = moment(this.currentCertificate['editorActionTimeStamp']).format('LLL')
    }
    document.getElementById('editorActionModalCLoseButton').click();
  })



}
onFileChosen(event, doc, i): void {
  let reader = new FileReader()

  if (event.target.files && event.target.files.length) {
    const file = event.target.files[0]

    doc.file = file;
    reader.readAsDataURL(file)

    this.uploadSignedDocument(doc, i)
    reader.onload = () => {
      //this.createEventForm.controls['eventImage'].setValue(file)
      doc.preview = reader.result
    }

    // need to run CD since file load runs outside of zone
  }
}

uploadSignedDocument = (doc, i) => {
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

          this.updateSignedDocumentStatus('CO');
        }else{
          this.saveFileDocument(formData, this.currentCertificate['_id']);
          this.updateSignedDocumentStatus(doc.name);

        }
      }, 200)

}

clearModel(){
  this.acceptDocuments = [];
  this.getCertificateById(this.certificateId);


}

updateSignedDocumentStatus(name){
let signedDocument = this.currentCertificate['signedDocument'];
_.forEach(signedDocument, doc => {
  if(doc.name.toLowerCase() == name.toLowerCase()){
    doc.isSigned = true;
  }
})

  this.certificateService.updateSigningStatus({certificateId: this.currentCertificate['_id'], signedDocument: signedDocument}).subscribe(response => {
    if(response['status'] == "success"){
      this.getCertificateById(this.currentCertificate['_id']);
    }
  })
}
onDocUploadClicked(event, index): void {
  event.preventDefault()
  let id = "certificateDocInput-" + index;
  document.getElementById(id).click();

}

digitallySignDoc(event, index){
  let doc = this.acceptDocuments[index];
  this.certificateService.getBase64Format(doc.oldUrl).subscribe(res =>{
    doc.base = res['data'];
    let today = new Date()
    let uniqueId = this.currentCertificate['_id'];
    uniqueId = uniqueId + '|' + doc.name;
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
          "<cood>50,85</cood>"+
          "<size>120,85</size>"+
          "</pdf>"+
          "<data>"+doc.base +"</data>"+
        '</request>';
      body.replace(/"/g, '+');
      this.certificateService.sendXMLToSign(body).subscribe(res=>{

      // convert xml to Json and send
      let result1 = converter.xml2json(res, {compact: true, spaces: 2});
      if(result1){
        const JSONData = JSON.parse(result1);
        this.certificateService.uploadXMLSignedDocument(JSONData).subscribe(data=>{

          // if(data['success']){
              setTimeout( () => {this.getCertificateById(this.certificateId) }, 500);
          // }


        },
        error => {
          this.toastr.error('',error.message);
        });
      }else{
        console.log('result1', result1)
      }

    }, (error) => {
      console.log("error", error);
      this.toastr.error("", "Signing Tool Not Connected. ")
    });
  });
  
}

issueCO(){
  let signedDocument = this.currentCertificate['signedDocument'];
  let isAllSigned = false;
  let notSigned = []
  _.forEach(signedDocument, doc => { 
    if(!doc.isSigned) { notSigned.push(doc); } 
  });
  if( notSigned && notSigned.length > 0){
    this.showError ="All Documents not Signed";
    return false;
  }
  this.currentCertificate['issuedBy'] = this.user['firstName'] + ' ' + this.user['lastName'];
    this.currentCertificate['issuedById'] = this.user['_id'];

    this.certificateService.acceptCertificate(this.currentCertificate).subscribe(data => {

      this.getCertificateById(this.currentCertificate['_id']);
      document.getElementById("acceptModelCloseButton").click();

    });
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
                      let user = JSON.parse(sessionStorage.getItem('currentUser'));
                      this.currentCertificate['issuedBy'] = user['firstName'] + ' ' + user['lastName'];
                      this.currentCertificate['issuedById'] = user['_id'];
                    this.certificateService.acceptCertificate(this.currentCertificate).subscribe(data => {

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

signDocHandel(i, doc, documentLength){
  this.certificateService.getBase64Format(doc.url).subscribe(res =>{
    doc.base = res['data']
    
    
    let today = new Date()
    let uniqueId = this.currentCertificate['_id'];
    
    uniqueId = uniqueId + '|' + doc.name;
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
          "<cood>50,85</cood>"+
          "<size>120,85</size>"+
          "</pdf>"+
          "<pdf>"+
          "<page>1</page>"+
          "<cood>25,25</cood>"+
          "<size>200,100</size>"+
          "</pdf>"+
          "<data>"+doc.base +"</data>"+
        '</request>';
      body.replace(/"/g, '+');
      this.certificateService.sendXMLToSign(body).subscribe(res=>{

      // convert xml to Json and send
      let result1 = converter.xml2json(res, {compact: true, spaces: 2});
      if(result1){
        const JSONData = JSON.parse(result1);
        this.certificateService.uploadXMLSignedDocument(JSONData).subscribe(data=>{

          if(data['success']){
              this.getCertificateById(this.certificateId)  
          }

          if(i == documentLength){
            setTimeout(()=> {
              this.currentCertificate['issuedBy'] = this.user['firstName'] + ' ' + this.user['lastName'];
              this.currentCertificate['issuedById'] = this.user['_id'];

              this.certificateService.acceptCertificate(this.currentCertificate).subscribe(data => {
  
                this.getCertificateById(this.currentCertificate['_id']);
                document.getElementById("acceptModelCloseButton").click();
  
              });
            }, i* 500);
          }

        },
        error => {
          this.toastr.error('',error.message);
        });
      }else{
        console.log('result1', result1)
      }

    }, (error) => {
      console.log("error", error);
      this.toastr.error("", "Signing Tool Not Connected. ")
    });
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
        documentsToSign.forEach( async doc => {
          
          i++;
          if(i == documentsToSign.length -1){
            document.getElementById('acceptModelCloseButton').click();
            this.toastr.success('', "Signing Request sent successfully");
          }
           await this.signDocHandel(i, doc, documentsToSign.length)
          
         
        })
      }
       
  }

  goToOldCO = (ref) => {
    this.certificateService.getCertificateByReference(ref).subscribe(data => {
      if(data['status'] == 'success'){

        let oldCertId = data['data']['_id'];
        this.certificateId = oldCertId;
        this.router.navigate(['/plci/' + oldCertId]);

        this.getCertificateById(this.certificateId)

      }

    });

  }
  
  


}
