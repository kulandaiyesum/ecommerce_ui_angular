import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-product-view-details',
  templateUrl: './product-view-details.component.html',
  styleUrls: ['./product-view-details.component.css'],
})
export class ProductViewDetailsComponent implements OnInit {
  selectedProductIndex = 0;
  product: Product = {} as Product;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.product = this.activatedRoute.snapshot.data['product'];
  }
  changeIndex(index: number) {
    this.selectedProductIndex = index;
  }
  buyProduct(productId: number) {
    this.router.navigate([
      '/buyProduct',
      {
        isSingleProductCheckout: true,
        id: productId,
      },
    ]);
  }
  addToCart(productId: number) {
    this.productService.addToCart(productId).subscribe(
      (resp: any) => {
        console.log(resp);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
