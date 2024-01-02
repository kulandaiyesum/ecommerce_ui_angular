import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css'],
})
export class BuyProductComponent implements OnInit {
  productDetails: Product[] = [];
  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: [],
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.productDetails.forEach((x) =>
      this.orderDetails.orderProductQuantityList.push({
        productId: x.productId,
        quantity: 1,
      })
    );
    console.log(this.productDetails);
    console.log(this.orderDetails);
  }
  public placeOrder(orderForm: NgForm) {
    this.productService.placeOrder(this.orderDetails).subscribe(
      (resp) => {
        console.log(resp);
        orderForm.reset();
        this.route.navigate(['/orderConfirm']);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  getQuantityForProduct(productId: number) {
    const fiteredProduct = this.orderDetails.orderProductQuantityList.filter(
      (productQuantity) => productQuantity.productId === productId
    );
    return fiteredProduct[0].quantity;
  }

  getCalculatedTotal(productId: number, productDiscountedPrice: number) {
    return this.getQuantityForProduct(productId) * productDiscountedPrice;
  }

  onQuantityChanged(quantityValue: any, productId: number) {
    this.orderDetails.orderProductQuantityList.filter(
      (orderProduct) => orderProduct.productId === productId
    )[0].quantity = quantityValue;
  }

  getCalculatedGrandTotal() {
    let grandTotal = 0;
    this.orderDetails.orderProductQuantityList.forEach((productQuantity) => {
      const price = this.productDetails.filter(
        (product) => product.productId === productQuantity.productId
      )[0].productDiscountedPrice;
      grandTotal += price * productQuantity.quantity;
    });
    return grandTotal;
  }
}
