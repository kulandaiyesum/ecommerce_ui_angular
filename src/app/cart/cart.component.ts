import { Router } from '@angular/router';
import { ProductService } from './../_services/product.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'description',
    'price',
    'discountedPrice',
    'action',
  ];
  constructor(private productService: ProductService, private router: Router) {}
  cartDetails = [];
  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails() {
    this.productService.getCartDetals().subscribe(
      (res: any) => {
        this.cartDetails = res;
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  checkout() {
    this.router.navigate([
      '/buyProduct',
      {
        isSingleProductCheckout: false,
        id: 0,
      },
    ]);
    // this.productService.getProductDetails(false, 0).subscribe(
    //   (res: any) => {
    //     console.log(res);
    //   },
    //   (err: any) => {
    //     console.log(err);
    //   }
    // );
  }
  deleteItem(cartId: number) {
    console.log(cartId);
    this.productService.deleteCartItem(cartId).subscribe(
      (res: any) => {
        this.getCartDetails();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
