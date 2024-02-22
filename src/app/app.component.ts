import { Component } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColDef, ColGroupDef, PaginationNumberFormatterParams} from "ag-grid-community";
import transactionData from '../data/transactions.json';
import accountsData from '../data/accounts.json';

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

  paginationPageSize = 20;
  paginationPageSizeSelector: number[] | boolean = [20, 50, 100];
  accountInfo = new Map(accountsData.map(acc => [acc._id, acc]));

  rowData: any[] = [];

  colDefs: (ColDef | ColGroupDef)[] = [
    { field: '_id', headerName: 'ID' },
    { field: 'direction', headerName: 'Direction' },
    { field: 'description', headerName: 'Description' },
    { field: 'accountId', headerName: 'Account ID'},
    { field: 'accountName', headerName: 'Account Name' },
    { field: '_revalTransaction', headerName: 'Reveal Transaction' },
    { headerName: 'Actual Quantity',
      children: [
        { field: '_quantity._actualQuantity._amount', headerName: 'Amount' },
        { field: '_quantity._actualQuantity._precision', headerName: 'Precision' },
        { field: '_quantity._actualQuantity._symbol', headerName: 'Currency Symbol' },
      ]
    },
    { field: '_currency', headerName: 'Currency'},
    { headerName: 'Valuation',
      children: [
        {
          headerName: 'Value',
          children: [
            { field: '_valuation._value._amount', headerName: 'Amount' },
            { field: '_valuation._value._precision', headerName: 'Precision' },
            { field: '_valuation._value._symbol', headerName: 'Currency' },
          ]
        },
        {
          headerName: 'Normalized Value',
          children: [
            { field: '_valuation._normalizedValue._amount', headerName: 'Amount' },
            { field: '_valuation._normalizedValue._precision', headerName: 'Precision' },
            { field: '_valuation._normalizedValue._symbol', headerName: 'Currency' },
          ]
        }
      ]
    },
    { field: '_transactionDate', headerName: 'Transaction Date' },
    { field: 'category', headerName: 'Category' },
    { field: 'classifications', headerName: 'Classifications'}
  ];

  private phaseData(): void {
    this.rowData = transactionData.map(item => {
      // 从Map中根据accountId找到相应的账户信息
      const accountInfo = this.accountInfo.get(item.accountId)!;
      return {
        ...item,
        accountName: accountInfo.name, // 使用账户信息中的名称替换原有的 accountId
        _currency: accountInfo.currency, // 添加账户的货币信息
        '_quantity._actualQuantity._amount': item._quantity._actualQuantity._amount,
        '_quantity._actualQuantity._precision': item._quantity._actualQuantity._precision,
        '_quantity._actualQuantity._symbol': item._quantity._actualQuantity._symbol,
        '_valuation._value._amount': item._valuation._value._amount,
        '_valuation._value._precision': item._valuation._value._precision,
        '_valuation._value._symbol': item._valuation._value._symbol,
        '_valuation._normalizedValue._amount': item._valuation._normalizedValue._amount,
        '_valuation._normalizedValue._precision': item._valuation._normalizedValue._precision,
        '_valuation._normalizedValue._symbol': item._valuation._normalizedValue._symbol,
        _transactionDate: this.dateTransformer(item._transactionDate),
        classifications: this.classificationsTransformer(item.classifications),
      };
    });
  }

  private dateTransformer(date: any): string {
    if (typeof date === 'string') {
      return date;
    } else if (date && typeof date === 'object') {
      let dateString = date.date || '';
      let timeString = date.time ? ` ${date.time}` : '';
      let tzString = date.tz ? ` ${date.tz}` : '';
      return `${dateString}${timeString}${tzString}`;
    }
    return '-';
  }

  private classificationsTransformer(classifications: string[]): string {
    return classifications.map(c => c.slice(-1)).join(', ');
  }

  public paginationNumberFormatter: (
    params: PaginationNumberFormatterParams
  ) => string = (params: PaginationNumberFormatterParams) => {
    return '[' + params.value.toLocaleString() + ']';
  };

  constructor() {
    this.phaseData();
  }
}
