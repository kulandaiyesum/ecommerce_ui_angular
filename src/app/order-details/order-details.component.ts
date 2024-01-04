import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MyOrderDetails } from '../_model/order.model';
import { ProductService } from './../_services/product.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css'],
})
export class OrderDetailsComponent implements OnInit {
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'Name',
    'Address',
    'Contact no.',
    'Amount',
    'Status',
    'Action',
  ];
  status: string = 'All';
  datasource!: MatTableDataSource<MyOrderDetails[]>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllOrders(this.status);
  }

  getAllOrders(status: string) {
    this.productService.getAllOrderDetailsForAdmin(status).subscribe(
      (res: any) => {
        this.datasource = new MatTableDataSource(res);
        this.datasource.paginator = this.paginator;
        this.datasource.sort = this.sort;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }

  filterOrderDetails() {
    this.getAllOrders(this.status);
  }

  markAsDeliverd(orderId: number) {
    this.productService.markAsDeliverd(orderId).subscribe(
      (res: any) => {
        this.getAllOrders(this.status);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
