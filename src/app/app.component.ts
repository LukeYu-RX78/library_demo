import { Component } from '@angular/core';
import {AgGridAngular} from "ag-grid-angular";
import {ColDef} from "ag-grid-community";

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
  title = 'Transation Table';
  rowData: any[] = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 }
  ];
  colDefs: ColDef[]=[
    {field: 'make'},
    {field: 'model'},
    {field: 'price'}
  ];
}
