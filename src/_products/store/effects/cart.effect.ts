import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';

import * as cartActions from '../actions/cart.action';
import * as fromServices from '../../services';

@Injectable()
export class CartEffects {
  constructor(
    private actions$: Actions,
    private cartService: fromServices.CartService
  ) {}

  @Effect()
  getCart$ = this.actions$.ofType(cartActions.GET_CART).pipe(
    switchMap(() => {
      return this.cartService
        .getCart()
        .pipe(
          map(cart => new cartActions.GetCartSuccess(cart)),
          catchError(error => of(new cartActions.GetCartFail(error)))
        );
    })
  );

  @Effect()
  addProductToCart$ = this.actions$.ofType(cartActions.ADD_PRODUCT_TO_CART).pipe(
    map((action: cartActions.AddProductToCart) => action.payload),
    switchMap(cart => {
      return this.cartService
        .addProductToCart(cart)
        .pipe(
          map(cart => new cartActions.AddProductToCartSuccess(cart)),
          catchError(error => of(new cartActions.AddProductToCartFail(error)))
        );
    })
  );

  @Effect()
  addProductToOrders$ = this.actions$.ofType(cartActions.ADD_PRODUCT_TO_ORDERS).pipe(
    map((action: cartActions.AddProductToOrders) => action.payload),
    mergeMap(cart => {
      return this.cartService
        .addProductToOrders(cart)
        .pipe(
          map(cart => new cartActions.AddProductToOrdersSuccess(cart)),
          catchError(error => of(new cartActions.AddProductToOrdersFail(error)))
        );
    })
  );

  @Effect()
  updateProductInCart$ = this.actions$.ofType(cartActions.UPDATE_PRODUCT_IN_CART).pipe(
    map((action: cartActions.UpdateProductInCart) => action.payload),
    mergeMap(cart => {
      return this.cartService
        .updateProductInCart(cart)
        .pipe(
          map(cart => new cartActions.UpdateProductInCartSuccess(cart)),
          catchError(error => of(new cartActions.UpdateProductInCartFail(error)))
        );
    })
  );

  @Effect()
  updateProductQuantity$ = this.actions$.ofType(cartActions.UPDATE_PRODUCT_QUANTITY).pipe(
    map((action: cartActions.UpdateProductQuantity) => action.payload),
    switchMap(cart => {
      return this.cartService
        .updateProductQuantity(cart)
        .pipe(
          map(cart => new cartActions.UpdateProductQuantitySuccess(cart)),
          catchError(error => of(new cartActions.UpdateProductQuantityFail(error)))
        );
    })
  );

  @Effect()
  deleteProductFromCart$ = this.actions$.ofType(cartActions.DELETE_PRODUCT_FROM_CART).pipe(
    map((action: cartActions.DeleteProductFromCart) => action.payload),
    mergeMap(cart => {
      return this.cartService
        .deleteProductFromCart(cart)
        .pipe(
          map(cart => new cartActions.DeleteProductFromCartSuccess(cart)),
          catchError(error => of(new cartActions.DeleteProductFromCartFail(error)))
        );
    })
  );

}
