import { Component, OnInit } from '@angular/core';
import { CertificateService } from '../../services/certificate.service';

@Component({
  selector: 'app-members-login',
  templateUrl: './members-login.component.html',
  styleUrls: ['./members-login.component.css']
})
export class MembersLoginComponent implements OnInit {

  constructor(private certificateService: CertificateService) { }
  imagesUrl: object; 
  referenceNumber: any;
  invoiceNumber: any;
  companyName: any;
  showError: string = '';
  currentCertificate: object;
  ngOnInit(): void {
    // this.imagesUrl = ['https://www.indianchamber.org/wp-content/uploads/2020/04/Webiner-Health-Wellbeing-1.png', 'https://www.indianchamber.org/wp-content/uploads/2020/03/Banner-3.png', 'https://www.indianchamber.org/wp-content/uploads/2019/04/WhatsApp-Image-2020-01-23-at-5.10.31-PM-1.jpeg', 'https://www.indianchamber.org/wp-content/uploads/2019/04/WhatsApp-Image-2020-02-03-at-6.16.54-PM.jpeg', 'https://www.indianchamber.org/wp-content/uploads/2019/04/WhatsApp-Image-2020-02-13-at-12.33.09-PM.jpeg'];
  }

  setUser(): void {
    localStorage.setItem('user', JSON.stringify({name: " ICC Admin", email: 'admin@icc.com', role: 0}));

  }

  getCert = (referenceNumber, companyName, invoiceNumber) =>{
    this.showError = ''
    if(!referenceNumber || referenceNumber == ''){
      this.showError = "CO Reference Number is required";
      return false;

    }

    this.certificateService.getCertificateByRef(referenceNumber).subscribe(data => {
      if(data['status'] == "success"){
          if(data['data']){
            
            if(data['data']['docStatus'] == 'issued'){

               let currentCertificate = data['data'];
               // check other fields
               if(companyName ){

                if(currentCertificate.exporter.toLowerCase() == companyName.toLowerCase()){
                  this.currentCertificate = currentCertificate;
                }else if(currentCertificate.consignee.toLowerCase() == companyName.toLowerCase()){
                  this.currentCertificate = currentCertificate;
   
                }else{
                  this.showError = "No Record Found";;
                  return false;
                }

               }else if(invoiceNumber && invoiceNumber != ''){

                if(currentCertificate.goods[0].invoiceNumber.toLowerCase().trim() == invoiceNumber.toLowerCase().trim()){
                  this.currentCertificate = currentCertificate;
                }else{
                  this.showError = "No Record Found";;
                  return false;
                }

               }else{
                this.showError = "Please Enter Company Name or Invoice Number to fetch the Document";
                return false;
               }
            }else{
              this.showError = "Certificate is not Issued.";

            }
          }else{
            this.showError = "No Record Found";

          }
      }else{
        this.showError = "No Record Found";
      }
    });
  }

  openPDF = (src)=>{
    src = src.replace("http:", "https:");
    document.getElementById("full")['href'] = src;
    document.getElementById("full").click();
  }

}
