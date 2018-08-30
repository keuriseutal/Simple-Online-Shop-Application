import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Location } from "@angular/common";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as fromUserStore from "../../../_users/store";
import * as fromProductStore from "../../store";

import { Item } from "../../models/items.model";
import { Product } from "../../models/products.model";
import { User } from "../../../_users/models/users.model";
import { map } from "../../../../node_modules/rxjs/operators";

@Component({
  selector: 'transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  orders$: Observable<Item[]>;
  loggedUser: User;

  constructor(
    private ordersStore: Store<fromProductStore.OrdersState>,
    private productStore: Store<fromProductStore.ProductsState>,
    private userStore: Store<fromUserStore.UsersState>,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    this.orders$ = this.ordersStore
      .select(fromProductStore.getAllOrders)
      .pipe(map(orders => orders.filter(c => this.loggedUser["id"] == c.userId)));
    this.ordersStore.dispatch(new fromProductStore.GetOrders());
  }

  setAsLoggedOut(event) {
    let user = this.loggedUser;
    user.isLoggedIn = false;
    this.userStore.dispatch(new fromUserStore.UpdateUser(user));

    console.log("logged Out: " + user["uname"] + user["isLoggedIn"]);
    localStorage.removeItem("loggedUser");
  }



}
