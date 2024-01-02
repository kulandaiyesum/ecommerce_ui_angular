import { ImageProcessingService } from './image-processing.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Product } from './_model/product.model';
import { Observable, map, of } from 'rxjs';
import { ProductService } from './_services/product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductResolveService implements Resolve<Product> {
  constructor(
    private productService: ProductService,
    private imageProcessingService: ImageProcessingService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Product> {
    const id = route.paramMap.get('productId');
    if (id) {
      // then we have to fetch details from product
      return this.productService.getProductDetailsById(id).pipe(
        map(p => this.imageProcessingService.createImages(p))
      );
    } else {
      // return empty product Observable.
      return of(this.getProductDetails());
    }
  }
  getProductDetails() {
    return {
      productId: 0,
      productName: '',
      productDescription: '',
      productDiscountedPrice: 0,
      productActualPrice: 0,
      productImages: [],
    };
  }
}
