import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Item } from "../models/items.model";

const PURCHASES_API = "http://localhost:3000/purchases";

@Injectable()
export class PurchasesService {
  constructor(private http: HttpClient) {}

  //#region services for products in purchases
  getPurchases(): Observable<Item[]> {
    return this.http
      .get<Item[]>(PURCHASES_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
  //#endregion

}
