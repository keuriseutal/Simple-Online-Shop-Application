import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.css"]
})
export class CartComponent implements OnInit {
  cart$: Observable<Item[]>;
  loggedUser: User;
  total: number;
  quantity: number;

  constructor(
    private cartStore: Store<fromProductStore.CartsState>,
    private productStore: Store<fromProductStore.ProductsState>,
    private userStore: Store<fromUserStore.UsersState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    this.cart$ = this.cartStore
      .select(fromProductStore.getAllCart)
      .pipe(map(cart => cart.filter(c => this.loggedUser["id"] == c.userId)));
    this.cartStore.dispatch(new fromProductStore.GetCart());
  }

  setAsLoggedOut(event) {
    let user = this.loggedUser;
    user.isLoggedIn = false;
    this.userStore.dispatch(new fromUserStore.UpdateUser(user));

    console.log("logged Out: " + user["uname"] + user["isLoggedIn"]);
    localStorage.removeItem("loggedUser");
  }

  getTotal(event: number) {
    this.total = event;
  }

  removeFromCart(event: Item) {
    let cart: Item[];
    this.cart$.subscribe(c => (cart = c));

    //check get product in cart
    for (let i = 0; i < cart.length; i++) {
      if (event.id == cart[i].id) {
        this.cartStore.dispatch(
          new fromProductStore.DeleteProductFromCart(event)
        );
        location.reload();
        window.alert("Sucessfully removed " + cart[i].name + " from cart");
        break;
      }
    } //end LOOP get user cart
  } //end on remove from cart

  checkOut() {
    let cart: Item[];
    this.cart$.subscribe(c => (cart = c));

    //check get products in cart

    const mappedCart = cart.map(c => {
      c = { ...c, total: this.total };

      return c;
    });

    for (let i = 0; i < mappedCart.length; i++) {
      let newCart: Item = mappedCart[i];
      this.cartStore.dispatch(
        new fromProductStore.UpdateProductInCart(newCart)
      );
      continue;
    }
  } //end on checkOut

  getQuantity(event: number) {
    this.quantity = event;
  } //end getQuantity

  updateQuantityOfItem(event: Item) {
    let cart: Item[];
    this.cart$.subscribe(c => (cart = c));

    const mappedCart = cart.map(c => {
      if (c.id === event.id) {
        c = { ...c, total: this.total, quantity: this.quantity };
      }
      this.cartStore.dispatch(new fromProductStore.UpdateProductInCart(c));
    });
  } //end updateQuantityOfItem

  submitAsOrder() {
    //missing: update quantity for existing products in orders
    let cart: Item[];
    this.cart$.subscribe(c => (cart = c));
    const mappedCart = cart.map(c => {
      c = { ...c, total: this.total, status: "Pending" };
      let item = c;
      c = { ...c, id: 0 };
      this.cartStore.dispatch(new fromProductStore.AddProductToOrders(c));
      this.cartStore.dispatch(new fromProductStore.DeleteProductFromCart(item));
    });
    window.alert("Your cart was successfully added to orders");
    location.reload();
  }
}
