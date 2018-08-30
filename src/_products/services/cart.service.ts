import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { map } from "rxjs/operators";

import { Item } from "../models/items.model";
import { Product } from "../models/products.model";

const CART_API = "http://localhost:3000/cart";
const ORDERS_API = "http://localhost:3000/orders";
const PRODUCTS_API = "http://localhost:3000/products";

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
}
@Injectable()
export class CartService {
  constructor(private http: HttpClient) {}

  //#region services for products in cart
  getCart(): Observable<Item[]> {
    return this.http
      .get<Item[]>(CART_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  addProductToCart(payload: Item): Observable<Item> {
    return this.http
      .post<Item>(CART_API, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  addProductToOrders(payload: Item): Observable<Item> {
    return this.http
      .post<Item>(ORDERS_API, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateProductInCart(payload: Item): Observable<Item> {
    return this.http
      .put<Item>(`${CART_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateProductQuantity(payload: Product): Observable<Product> {
    return this.http
      .put<Product>(`${PRODUCTS_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  deleteProductFromCart(payload: Item): Observable<Item> {
    return this.http
      .delete<Item>(`${CART_API}/${payload.id}`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
  //#endregion
}
