import { OrderDetails } from './../_model/order-details.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from '../_model/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private httpClient: HttpClient) {}

  public addProduct(product: FormData) {
    return this.httpClient.post<Product>(
      'http://localhost:9090/addNewProduct',
      product
    );
  }
  public getAllProducts(pageNumber: number, searchkeyword: string = '') {
    return this.httpClient.get<Product[]>(
      'http://localhost:9090/getAllProducts?pageNumber=' +
        pageNumber +
        '&searchKey=' +
        searchkeyword
    );
  }
  public getProductDetailsById(productId: any) {
    return this.httpClient.get<Product>(
      'http://localhost:9090/getProductDetailsById/' + productId
    );
  }

  public deleteProduct(productId: number) {
    return this.httpClient.delete(
      `http://localhost:9090/deleteProductDetails/${productId}`
    );
  }

  /**
   * function checkout
   * @param isSingleProductCheckout
   * @param productId
   * @returns
   */
  public getProductDetails(isSingleProductCheckout: any, productId: any) {
    return this.httpClient.get<Product[]>(
      'http://localhost:9090/getProductDetails/' +
        isSingleProductCheckout +
        '/' +
        productId
    );
  }

  public placeOrder(
    orderDetails: OrderDetails,
    isSingleProductCheckout: boolean
  ) {
    return this.httpClient.post(
      'http://localhost:9090/placeOrder/' + isSingleProductCheckout,
      orderDetails
    );
  }

  public addToCart(productId: number) {
    return this.httpClient.get('http://localhost:9090/addToCart/' + productId);
  }

  public getCartDetals() {
    return this.httpClient.get('http://localhost:9090/getCartDetails');
  }
}
