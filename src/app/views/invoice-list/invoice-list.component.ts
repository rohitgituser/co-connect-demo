import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice.service';
import { UserRole } from '../../enums/user-role';
import * as moment from 'moment';
import _ from "lodash";

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
    let toDate = new Date();
    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
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
    let today = new Date();
    let toDate = new Date();

    this.fromDate = new Date(today.setMonth(today.getMonth() - 3)).toISOString().split('T')[0];
    this.toDate = new Date(toDate).toISOString().split('T')[0];
    this.getInvoices('', this.fromDate, this.toDate, '1');

  }

  openPDF = (src)=>{
    document.getElementById("full")['href'] = src;
    document.getElementById("full").click();
  }

  exportInvoiceUser(searchText, startDate, endDate){
    this.invoiceService.getExportInvoiceUser(searchText, startDate, endDate).subscribe(data => {
      if(data['status'] == "success"){
        let exportInvoices = data['data'];
        let exportInvoicesArranged = [];
        _.forEach(exportInvoices, invoice => {
          invoice.invoiceDate = moment(invoice.invoiceDate).format('L');
          invoice.createdAt = moment(invoice.createdAt).format('L');
          let igst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'IGST'});
          let cgst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'CGST'});
          let sgst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'SGST'});
          let taxableValue = _.find(invoice.taxDetails, (inv) => { return inv.description == 'CGST' || inv.description == 'IGST' });
          invoice.IGST = _.isEmpty(igst) ? '0': igst.amount;
          invoice.CGST = _.isEmpty(cgst) ? '0': cgst.amount;
          invoice.SGST = _.isEmpty(sgst) ? '0': sgst.amount;
          invoice.taxableValue = _.isEmpty(taxableValue) ? '0': taxableValue.taxableValue;
          delete invoice.invoiceItems;

          exportInvoicesArranged.push({
            invoicePaid: invoice.invoicePaid,
            invoiceDate: invoice.invoiceDate,	
           ' item name': invoice.itemName,	
            deliveryNote: invoice.deliveryNote,	
            suppliersRef: invoice.suppliersRef,	
            'buyer name': invoice.buyer, 
            buyerOrderNo: invoice.buyerOrderNo,	
            dateOfBuyerOrder: invoice.dateOfBuyerOrder,	
            dispatchedDocumentNo: invoice.dispatchedDocumentNo,	
            destination: invoice.destination,	
            deliveryTerms: invoice.deliveryTerms,	
            totalQuantity: invoice.totalQuantity,	
            taxableAmount: invoice.taxableValue,
            totalAmount: invoice.totalAmount,	
            totalAmountWords: invoice.totalAmountWords,	
            IGST: invoice.IGST,	
            CGST: invoice.CGST,	
            SGST: invoice.SGST,	
            remark: invoice.remark,	
            invoiceNo: invoice.invoiceNo,	
            totalTaxAmountWords: invoice.totalTaxAmountWords,	
            createdAt: invoice.createdAt,	
            payMode: invoice.payMode,	
            transactionID: invoice.transactionID,		
          })

        })
        let date = moment().format();
        let csvName = 'Invoices-' + date + '.csv'
        this.exportToCsv(csvName, exportInvoicesArranged);
      }
    });
  }
  exportInvoice(searchText, startDate, endDate){
    this.invoiceService.getExportInvoice(searchText, startDate, endDate).subscribe(data => {
      if(data['status'] == "success"){
        let exportInvoices = data['data'];
        let exportInvoicesArranged = [];
        _.forEach(exportInvoices, invoice => {
          invoice.invoiceDate = moment(invoice.invoiceDate).format('L');
          invoice.createdAt = moment(invoice.createdAt).format('L');
          let igst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'IGST'});
          let cgst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'CGST'});
          let sgst = _.find(invoice.invoiceItems, (inv) => { return inv.description == 'SGST'});
          let taxableValue = _.find(invoice.taxDetails, (inv) => { return inv.description == 'CGST' || inv.description == 'IGST' });

          invoice.IGST = _.isEmpty(igst) ? '0': igst.amount;
          invoice.CGST = _.isEmpty(cgst) ? '0': cgst.amount;
          invoice.SGST = _.isEmpty(sgst) ? '0': sgst.amount;
          invoice.taxableValue = _.isEmpty(taxableValue) ? '0': taxableValue.taxableValue;

          delete invoice.invoiceItems;

          exportInvoicesArranged.push({
            invoicePaid: invoice.invoicePaid,
            invoiceDate: invoice.invoiceDate,	
           ' item name': invoice.itemName,	
            deliveryNote: invoice.deliveryNote,	
            suppliersRef: invoice.suppliersRef,	
            'buyer name': invoice.buyer, 
            buyerOrderNo: invoice.buyerOrderNo,	
            dateOfBuyerOrder: invoice.dateOfBuyerOrder,	
            dispatchedDocumentNo: invoice.dispatchedDocumentNo,	
            destination: invoice.destination,	
            deliveryTerms: invoice.deliveryTerms,	
            totalQuantity: invoice.totalQuantity,	
            taxableAmount: invoice.taxableValue,

            totalAmount: invoice.totalAmount,	
            totalAmountWords: invoice.totalAmountWords,	
            IGST: invoice.IGST,	
            CGST: invoice.CGST,	
            SGST: invoice.SGST,	
            remark: invoice.remark,	
            invoiceNo: invoice.invoiceNo,	
            totalTaxAmountWords: invoice.totalTaxAmountWords,	
            createdAt: invoice.createdAt,	
            payMode: invoice.payMode,	
            transactionID: invoice.transactionID,		
          })

        })
        let date = moment().format();
        let csvName = 'Invoices-' + date + '.csv'
        this.exportToCsv(csvName, exportInvoicesArranged);
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
