import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Item } from "../models/items.model";

const ORDERS_API = "http://localhost:3000/orders";
const PURCHASES_API = "http://localhost:3000/purchases";

@Injectable()
export class OrdersService {
  constructor(private http: HttpClient) {}

  //#region services for products in orders
  getOrders(): Observable<Item[]> {
    return this.http
      .get<Item[]>(ORDERS_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  addProductToPurchases(payload: Item): Observable<Item> {
    return this.http
      .post<Item>(PURCHASES_API, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateProductInOrders(payload: Item): Observable<Item> {
    return this.http
      .put<Item>(`${ORDERS_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
  
  deleteProductFromOrders(payload: Item): Observable<Item> {
    return this.http
      .delete<Item>(`${ORDERS_API}/${payload.id}`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
  //#endregion

}
