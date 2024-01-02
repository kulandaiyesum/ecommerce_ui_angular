import { Component, OnInit } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_model/product.model';
import { map } from 'rxjs';
import { ImageProcessingService } from '../image-processing.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  pageNumber: number = 0;
  productDetails: Product[] = [];
  showLoadButton: boolean = false;
  constructor(
    private productService: ProductService,
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
          console.log(res);
          // this.productDetails = res;
          if (res.length === 12) {
            this.showLoadButton = true;
          } else {
            this.showLoadButton = false;
          }
          res.forEach((p) => this.productDetails.push(p));
        },
        (err: HttpErrorResponse) => {
          console.log(err);
        }
      );
  }
  showProductDetails(productId: number) {
    this.router.navigate(['/productViewDetails', { productId: productId }]);
  }
  loadMoreProduct() {
    this.pageNumber = this.pageNumber + 1;
    this.getAllProduct();
  }
}
