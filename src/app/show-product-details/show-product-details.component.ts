import { ImageProcessingService } from './../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Product } from '../_model/product.model';
import { ProductService } from './../_services/product.service';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ShowProductImagesDialogComponent } from '../show-product-images-dialog/show-product-images-dialog.component';
import { map } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-show-product-details',
  templateUrl: './show-product-details.component.html',
  styleUrls: ['./show-product-details.component.css'],
})
export class ShowProductDetailsComponent implements OnInit {
  showTable = false;
  displayedColumns: string[] = [
    'Id',
    'Product Name',
    'description',
    'Product Discounted price',
    'Product Actual price',
    'Actions',
  ];
  productDetails: Product[] = [];
  showLoadButton: boolean = false;
  pageNumber: number = 0;
  constructor(
    private productService: ProductService,
    public imageDialog: MatDialog,
    private imageProcessingService: ImageProcessingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getAllProduct();
  }
  searchByKeyword(searchkeyword: string) {
    console.log(searchkeyword);
    this.pageNumber = 0;
    this.productDetails = [];
    this.getAllProduct(searchkeyword);
  }
  public getAllProduct(searchKey: string = '') {
    this.showTable = false;
    this.productService
      .getAllProducts(this.pageNumber, searchKey)
      .pipe(
        map((x: Product[], i) =>
          x.map((product: Product) =>
            this.imageProcessingService.createImages(product)
          )
        )
      )
      .subscribe(
        (res: Product[]) => {
          // console.log(res);
          if (res.length === 12) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          res.forEach((p) => this.productDetails.push(p));
          // this.productDetails = res;
          console.log(this.productDetails);
          this.showTable = true;
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }
  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId).subscribe(
      (res) => {
        console.log(res);
        this.getAllProduct();
      },
      (err: HttpErrorResponse) => {
        console.log(err);
      }
    );
  }

  showImages(product: Product) {
    console.log(product);
    this.imageDialog.open(ShowProductImagesDialogComponent, {
      data: {
        images: product.productImages,
      },
      height: '500px',
      width: '800px',
    });
  }

  editProductDetails(productId: any) {
    this.router.navigate(['/addNewProduct', { productId: productId }]);
  }
  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProduct();
  }
}
