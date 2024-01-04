import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MyOrderDetails } from './../_model/order.model';
import { ProductService } from './../_services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  displayedColumns: string[] = [
    'Name',
    'Address',
    'Contact no.',
    'Amount',
    'Status',
  ];
  myOrderDetails!: MatTableDataSource<MyOrderDetails[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.productService.getOrderDetails().subscribe(
      (resp: any) => {
        // this.myOrderDetails = resp;
        this.myOrderDetails = new MatTableDataSource(resp);
        this.myOrderDetails.paginator = this.paginator;
        this.myOrderDetails.sort = this.sort;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
