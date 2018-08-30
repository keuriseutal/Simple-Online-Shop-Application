import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Product } from "../models/products.model";

const PRODUCTS_API = "http://localhost:3000/products";
const CART_API = "http://localhost:3000/cart";

@Injectable()
export class ProductsService {
  constructor(private http: HttpClient) {}

  //#region services for available products
  getProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(PRODUCTS_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateProduct(payload: Product): Observable<Product> {
    return this.http
      .put<Product>(`${PRODUCTS_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  //#endregion
  
}
