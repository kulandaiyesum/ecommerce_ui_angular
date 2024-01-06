import { Component, Injector, NgZone, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { OrderDetails } from '../_model/order-details.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../_model/product.model';
import { ProductService } from '../_services/product.service';
// import * as Razorpay from 'razorpay';

declare var Razorpay: any;

@Component({
  selector: 'app-buy-product',
  templateUrl: './buy-product.component.html',
  styleUrls: ['./buy-product.component.css'],
})
export class BuyProductComponent implements OnInit {
  productDetails: Product[] = [];
  isSingleProductCheckout: any; // boolean false or true
  orderDetails: OrderDetails = {
    fullName: '',
    fullAddress: '',
    contactNumber: '',
    alternateContactNumber: '',
    orderProductQuantityList: [],
    transactionId: '',
  };
  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private route: Router,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.productDetails = this.activatedRoute.snapshot.data['productDetails'];
    this.isSingleProductCheckout = this.activatedRoute.snapshot.paramMap.get(
      'isSingleProductCheckout'
    );
    console.log(
      this.isSingleProductCheckout,
      typeof this.isSingleProductCheckout
    );
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
    this.productService
      .placeOrder(this.orderDetails, this.isSingleProductCheckout)
      .subscribe(
        (resp) => {
          console.log(resp);
          orderForm.reset();
          const ngZone = this.injector.get(NgZone);
          ngZone.run(() => {
            this.route.navigate(['/orderConfirm']);
          });
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

  createTransactionAndPlaceOrder(orderForm: NgForm) {
    let amount = this.getCalculatedGrandTotal();
    this.productService.createTransaction(amount).subscribe(
      (res: any) => {
        console.log(res);
        //      {
        //        "orderId": "order_NKVjejdPqCuoZB",
        //        "currency": "INR",
        //        "amount": 1199900,
        //        "key":"********"
        //      }
        this.openTransactionModel(res, orderForm);
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
  openTransactionModel(response: any, orderForm: NgForm) {
    const options = {
      order_id: response.orderId,
      key: response.key,
      amount: response.amount,
      currency: response.currency,
      name: 'raj',
      description: 'Payment of online shopping',
      image:
        'https://cdn.pixabay.com/photo/2023/12/01/05/32/butterfly-8422900_640.jpg',
      handler: (response: any) => {
        if (response !== null && response.razorpay_payment_id !== null) {
          this.processResponse(response, orderForm);
        } else {
          alert('Payment Failed!');
        }
      },
      prefill: {
        name: 'LPY',
        email: 'LPY@gmail.com',
        contact: '7904577271',
      },
      notes: {
        address: 'Online shopping',
      },
      theme: {
        color: '#3f51b5',
      },
    };

    var rezorPayObject = new Razorpay(options);
    rezorPayObject.open();
  }

  processResponse(resp: any, orderForm: NgForm) {
    console.log(resp);
    this.orderDetails.transactionId = resp.razorpay_payment_id;
    // {
    //   "razorpay_payment_id": "pay_NKWsoV4MsCZ6QZ",
    //   "razorpay_order_id": "order_NKWqz9heLAQTUD",
    //   "razorpay_signature": "7b2c802fdbe1c722819b9b00634ed4d7da73e22009803a23088cfc68bd15cd31"
    // }
    this.placeOrder(orderForm);
  }
}
