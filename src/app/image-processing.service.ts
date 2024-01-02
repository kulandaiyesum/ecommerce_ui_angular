import { Injectable } from '@angular/core';
import { Product } from './_model/product.model';
import { FileHandle } from './_model/file-handle.model';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class ImageProcessingService {
  constructor(private sanitizer: DomSanitizer) {}

  public createImages(product: Product) {
    const protuctImages: any[] = product.productImages;
    const productImagesToFileHandle: FileHandle[] = [];
    for (let i = 0; i < protuctImages.length; i++) {
      const imageFileData = protuctImages[i];
      const imageBlob = this.dataURItoBlob(
        imageFileData.picByte,
        imageFileData.type
      );
      const imageFile = new File([imageBlob], imageFileData.name, {
        type: imageFileData.type,
      });
      const finalFileHandle: FileHandle = {
        file: imageFile,
        url: this.sanitizer.bypassSecurityTrustUrl(
          window.URL.createObjectURL(imageFile)
        ),
      };
      productImagesToFileHandle.push(finalFileHandle);
    }
    product.productImages = productImagesToFileHandle;
    return product;
  }

  // it will take picture byte to make blob
  public dataURItoBlob(picBytes: any, imageType: any) {
    const byteString = window.atob(picBytes);
    const arrryBuffer = new ArrayBuffer(byteString.length);
    const init8Array = new Uint8Array(arrryBuffer);
    for (let i = 0; i < byteString.length; i++) {
      init8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([init8Array], { type: imageType });
    return blob;
  }
}
