import { Action } from '@ngrx/store';

import { Item } from '../../models/items.model';

//#region get order
export const GET_ORDERS = '[Order] Get Orders';
export const GET_ORDERS_FAIL = '[Order] Get Order sFail';
export const GET_ORDERS_SUCCESS = '[Order] Get Orders Success';

export class GetOrders implements Action {
  readonly type = GET_ORDERS;
}

export class GetOrdersFail implements Action {
  readonly type = GET_ORDERS_FAIL;
  constructor(public payload: any) {}
}

export class GetOrdersSuccess implements Action {
  readonly type = GET_ORDERS_SUCCESS;
  constructor(public payload: Item[]) {}
}
//#endregion

//#region add product to purchases
export const ADD_PRODUCT_TO_PURCHASES = '[Order] ADD_PRODUCT_TO_PURCHASES';
export const ADD_PRODUCT_TO_PURCHASES_FAIL = '[Order] ADD_PRODUCT_TO_PURCHASES Fail';
export const ADD_PRODUCT_TO_PURCHASES_SUCCESS = '[Order] ADD_PRODUCT_TO_PURCHASES Success';

export class AddProductToPurchases implements Action {
  readonly type = ADD_PRODUCT_TO_PURCHASES;
  constructor(public payload: Item) {}
}

export class AddProductToPurchasesFail implements Action {
  readonly type = ADD_PRODUCT_TO_PURCHASES_FAIL;
  constructor(public payload: any) {}
}

export class AddProductToPurchasesSuccess implements Action {
  readonly type = ADD_PRODUCT_TO_PURCHASES_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

//#region update product in orders
export const UPDATE_PRODUCT_IN_ORDERS = '[Orders] UPDATE_PRODUCT_IN_ORDERS';
export const UPDATE_PRODUCT_IN_ORDERS_FAIL = '[Orders] UPDATE_PRODUCT_IN_ORDERS Fail';
export const UPDATE_PRODUCT_IN_ORDERS_SUCCESS = '[Orders] UPDATE_PRODUCT_IN_ORDERS Success';

export class UpdateProductInOrders implements Action {
  readonly type = UPDATE_PRODUCT_IN_ORDERS;
  constructor(public payload: Item) {}
}

export class UpdateProductInOrdersFail implements Action {
  readonly type = UPDATE_PRODUCT_IN_ORDERS_FAIL;
  constructor(public payload: any) {}
}

export class UpdateProductInOrdersSuccess implements Action {
  readonly type = UPDATE_PRODUCT_IN_ORDERS_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion


//#region delete product from orders
export const DELETE_PRODUCT_FROM_ORDERS = '[Order] DELETE_PRODUCT_FROM_ORDERS';
export const DELETE_PRODUCT_FROM_ORDERS_FAIL = '[Order] DELETE_PRODUCT_FROM_ORDERS Fail';
export const DELETE_PRODUCT_FROM_ORDERS_SUCCESS = '[Order] DELETE_PRODUCT_FROM_ORDERS Success';

export class DeleteProductFromOrders implements Action {
  readonly type = DELETE_PRODUCT_FROM_ORDERS;
  constructor(public payload: Item) {}
}

export class DeleteProductFromOrdersFail implements Action {
  readonly type = DELETE_PRODUCT_FROM_ORDERS_FAIL;
  constructor(public payload: any) {}
}

export class DeleteProductFromOrdersSuccess implements Action {
  readonly type = DELETE_PRODUCT_FROM_ORDERS_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

// action types
export type OrdersAction =
  | GetOrders
  | GetOrdersFail
  | GetOrdersSuccess
  | AddProductToPurchases
  | AddProductToPurchasesFail
  | AddProductToPurchasesSuccess
  | UpdateProductInOrders
  | UpdateProductInOrdersFail
  | UpdateProductInOrdersSuccess
  | DeleteProductFromOrders
  | DeleteProductFromOrdersFail
  | DeleteProductFromOrdersSuccess;
