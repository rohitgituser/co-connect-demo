import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { UserRole } from '../../enums/user-role';
import * as moment from 'moment';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
export class InvoiceListComponent implements OnInit {

  constructor(public invoiceService: InvoiceService) { }
  invoiceList: object;
  currentUser: Object;
  searchText: any = '';
  fromDate: any;
  toDate: any;
  page: any;
  pagination: any = {
    currentPage: 1,
    nextPage: 1,
    numOfResults: 0,
    pages: 1,
    perPage: 5
  };
  ngOnInit(): void {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    let today = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
    this.toDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
      this.getInvoices('', this.fromDate, this.toDate , '1');
  }

  getInvoices = (name, fromDate, toDate, page) => {

    if(this.currentUser && this.currentUser["role"] == UserRole.BA){
      this.invoiceService.getInvoices(name, fromDate, toDate, page).subscribe(data => {
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
          this.page = this.pagination['currentPage'];
          this.invoiceList = data['data']['invoices'];
        }

      });
    }

    if(this.currentUser && (this.currentUser["role"] == UserRole.ICC_ADMIN|| this.currentUser["role"] == UserRole.ICC_EDITOR )){
      this.invoiceService.getEditorInvoice(name, fromDate, toDate, page).subscribe(data => {
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
          this.page = this.pagination['currentPage'];
          this.invoiceList = data['data']['invoices'];
          console.log(this.invoiceList);
        }

      });
    }

  }

  updateFilter(searchText: String, startDate: String, endDate: String): void {

    this.getInvoices(searchText, startDate, endDate, '1');

  }
  pageChanged(event: any): void {
    if (event && !isNaN(event) && event != this.pagination.currentPage) {
    this.getInvoices(this.searchText, this.fromDate, this.toDate, event)
    }
  }

  callClear() {
    let today = new Date()
    this.fromDate = new Date(today.setMonth(today.getMonth() - 1)).toISOString().split('T')[0];
    this.toDate = new Date(today.setMonth(today.getMonth() + 3)).toISOString().split('T')[0];
    this.getInvoices('', this.fromDate, this.toDate, '1');

  }

  exportInvoice(searchText, startDate, endDate){
    this.invoiceService.getExportInvoice(searchText, startDate, endDate).subscribe(data => {
      if(data['status'] == "success"){
        let exportInvoices = data['data'];

        let date = moment().format();
        let csvName = 'Invoices-' + date + '.csv'
        this.exportToCsv(csvName, exportInvoices);
      }
    });
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
