import { Component, OnInit } from '@angular/core';
import { MastersService } from '../../services/masters.service';
import * as _ from "lodash";
import { paginationMaxSize } from '../../utilities/common'
import { CertificateService } from '../../services/certificate.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.css']
})
export class MembersListComponent implements OnInit {
  membersList: [];
  accountType: string[];
  selectedAccountType: string;
  searchText: string;
  pagination:any;
  page:any = 1;
  csvFile: any;
  maxSize: number = paginationMaxSize;
  constructor(private mastersService: MastersService,private certificateService: CertificateService,  private toastr: ToastrService) { }

  ngOnInit(): void {
    this.accountType = ["Active", "In-Active"];
    this.getMembersList('', '', this.page);
     this.pagination = {
      numOfResults: 0,
      currentPage: 1,
      perPage: 5
    }
   
    if(_.isEmpty(this.membersList) ){
      this.membersList = [];
    }
  }

  getMembersList (name: string, type:String, page:any){
    this.mastersService.getMembersList(name, type, page).subscribe(data => {

      this.membersList = data['data'].members;
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
    this.getMembersList(this.searchText, this.selectedAccountType, event)
    }
  }

  accountClicked(event): void{
    this.selectedAccountType = event.target.value;
      this.getMembersList(this.searchText, this.selectedAccountType, '1')
  }

  nameChanged(name): void {
    // this.selectedLocations = location.city;
    this.searchText = name;
    if(name && this.searchText.length > 2 ){
     this.getMembersList(this.searchText, this.selectedAccountType, '1')
    }
    if(!name){
      this.getMembersList(this.searchText, this.selectedAccountType, '1')
    }

  }

  importMembers = () => {
    document.getElementById('importMembers').click();
  }


  onFileChange(event) {
    // this.progressPer1 = 0;

    // let interval1 = setInterval(() => {
    //   if(this.progressPer1 < 100){
    //     let progress = this.progressPer1
    //     this.progressPer1 = progress + 5
    //   }else{
    //     clearInterval(interval1);
    //   }
      
    // }, 100)
    

      let reader = new FileReader()

    if (event.target.files && event.target.files.length) {
      const file = event.target.files[0]

      // doc.file = file;
      reader.readAsDataURL(file)
      // const [file] = event.target.files;
      // reader.readAsDataURL(file);
    
      reader.onload = () => {
   
        this.csvFile = reader.result as string;
        console.log('this.csvFile', this.csvFile);
        const formData = new FormData();
        
        console.log('reader.result', reader)
        formData.append('me',  "Rohit")
        formData.append('file', file);
        formData.append('name', 'membersCSV')
        this.mastersService.uploadMembersCSV(formData).subscribe(data => {
          console.log(data);
          if(data['status'] == "success"){
            this.getMembersList(this.searchText, this.selectedAccountType, '1');
            this.toastr.success('Success', 'Members Uploaded successfully.');

          }

        });
      };
   
    }
  }


  exportSampleCSV = () => {
    console.log('exportSampleCSV');
    this.exportToCsv('members-sample-template.csv', [{'Member No': '', 'Company Name': '', 'Is Active': ''}])
  }

  exportToCsv(filename: string, rows: object[]) {
    if (!rows || !rows.length) {
      return;
    }
    const separator = ',';
    const keys = Object.keys(rows[0]);
    
    const csvContent =
      keys.join(separator) +
      '\n' +
      rows.map(row => {
        return keys.map(k => {
          let cell = row[k] === null || row[k] === undefined ? '' : row[k];
          cell = cell instanceof Date
            ? cell.toLocaleString()
            : cell.toString().replace(/"/g, '""');
          if (cell.search(/("|,|\n)/g) >= 0) {
            cell = `"${cell}"`;
          }
          return cell;
        }).join(separator);
      }).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
      navigator.msSaveBlob(blob, filename);
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

}
