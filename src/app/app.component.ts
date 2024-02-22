import { Component } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColDef} from "ag-grid-community";
import transactionData from '../data/transactions.json';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    AgGridAngular
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})

export class AppComponent {
  title = 'Transaction Record';
  originData: any[] = transactionData;
  rowData: any[] = [];

  colDefs: ColDef[] = [
    { field: '_id', headerName: 'ID' },
    { field: 'direction', headerName: 'Direction' },
    { field: 'description', headerName: 'Description' },
    { field: 'accountId', headerName: 'Account ID' },
    { field: '_revalTransaction', headerName: 'Reveal Transaction' },
    {field: '_quantity', headerName: 'Quantity'},
    {field: '_valuation', headerName: 'Valuation'},
    { field: '_transactionDate', headerName: 'Transaction Date' },
    { field: 'category', headerName: 'Category' },
    {field: 'classifications', headerName: 'Classifications'}
  ];

  stringifyObject(obj: any): string {
    return Object.entries(obj).map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        return `${key}: ${this.stringifyObject(value)}`;
      }
      return `${key}: ${value}`;
    }).join(', ');
  }

  phaseOriginData(): void {
    this.rowData = this.originData.map(item => ({
      ...item,
      _quantity: this.stringifyObject(item._quantity),
      _valuation: this.stringifyObject(item._valuation),
      classifications: item.classifications.join(', ')
    }));
  }

  constructor() {
    this.phaseOriginData();
  }
}
