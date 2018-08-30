import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';

import * as ordersActions from '../actions/orders.action';
import * as fromServices from '../../services';

@Injectable()
export class OrdersEffects {
  constructor(
    private actions$: Actions,
    private ordersService: fromServices.OrdersService
  ) {}

  @Effect()
  getOrders$ = this.actions$.ofType(ordersActions.GET_ORDERS).pipe(
    switchMap(() => {
      return this.ordersService
        .getOrders()
        .pipe(
          map(orders => new ordersActions.GetOrdersSuccess(orders)),
          catchError(error => of(new ordersActions.GetOrdersFail(error)))
        );
    })
  );

  @Effect()
  addProductToPurchases$ = this.actions$.ofType(ordersActions.ADD_PRODUCT_TO_PURCHASES).pipe(
    map((action: ordersActions.AddProductToPurchases) => action.payload),
    switchMap(order => {
      return this.ordersService
        .addProductToPurchases(order)
        .pipe(
          map(order => new ordersActions.AddProductToPurchasesSuccess(order)),
          catchError(error => of(new ordersActions.AddProductToPurchasesFail(error)))
        );
    })
  );

  @Effect()
  updateProductInOrders$ = this.actions$.ofType(ordersActions.UPDATE_PRODUCT_IN_ORDERS).pipe(
    map((action: ordersActions.UpdateProductInOrders) => action.payload),
    mergeMap(orders => {
      return this.ordersService
        .updateProductInOrders(orders)
        .pipe(
          map(orders => new ordersActions.UpdateProductInOrdersSuccess(orders)),
          catchError(error => of(new ordersActions.UpdateProductInOrdersFail(error)))
        );
    })
  );

  @Effect()
  deleteProductFromOrders$ = this.actions$.ofType(ordersActions.DELETE_PRODUCT_FROM_ORDERS).pipe(
    map((action: ordersActions.DeleteProductFromOrders) => action.payload),
    switchMap(order => {
      return this.ordersService
        .deleteProductFromOrders(order)
        .pipe(
          map(order => new ordersActions.DeleteProductFromOrdersSuccess(order)),
          catchError(error => of(new ordersActions.DeleteProductFromOrdersFail(error)))
        );
    })
  );

}
