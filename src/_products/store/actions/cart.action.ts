import { Action } from '@ngrx/store';

import { Item } from '../../models/items.model';
import { Product } from '../../models/products.model';

//#region get cart
export const GET_CART = '[Cart] Get Cart';
export const GET_CART_FAIL = '[Cart] Get Cart Fail';
export const GET_CART_SUCCESS = '[Cart] Get Cart Success';

export class GetCart implements Action {
  readonly type = GET_CART;
}

export class GetCartFail implements Action {
  readonly type = GET_CART_FAIL;
  constructor(public payload: any) {}
}

export class GetCartSuccess implements Action {
  readonly type = GET_CART_SUCCESS;
  constructor(public payload: Item[]) {}
}
//#endregion

//#region add product to cart
export const ADD_PRODUCT_TO_CART = '[Cart] ADD_PRODUCT_TO_CART';
export const ADD_PRODUCT_TO_CART_FAIL = '[Cart] ADD_PRODUCT_TO_CART Fail';
export const ADD_PRODUCT_TO_CART_SUCCESS = '[Cart] ADD_PRODUCT_TO_CART Success';

export class AddProductToCart implements Action {
  readonly type = ADD_PRODUCT_TO_CART;
  constructor(public payload: Item) {}
}

export class AddProductToCartFail implements Action {
  readonly type = ADD_PRODUCT_TO_CART_FAIL;
  constructor(public payload: any) {}
}

export class AddProductToCartSuccess implements Action {
  readonly type = ADD_PRODUCT_TO_CART_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

//#region add product to orders
export const ADD_PRODUCT_TO_ORDERS = '[Orders] ADD_PRODUCT_TO_ORDERS';
export const ADD_PRODUCT_TO_ORDERS_FAIL = '[Orders] ADD_PRODUCT_TO_ORDERS Fail';
export const ADD_PRODUCT_TO_ORDERS_SUCCESS = '[Orders] ADD_PRODUCT_TO_ORDERS Success';

export class AddProductToOrders implements Action {
  readonly type = ADD_PRODUCT_TO_ORDERS;
  constructor(public payload: Item) {}
}

export class AddProductToOrdersFail implements Action {
  readonly type = ADD_PRODUCT_TO_ORDERS_FAIL;
  constructor(public payload: any) {}
}

export class AddProductToOrdersSuccess implements Action {
  readonly type = ADD_PRODUCT_TO_ORDERS_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

//#region update product in cart
export const UPDATE_PRODUCT_IN_CART = '[Cart] UPDATE_PRODUCT_IN_CART';
export const UPDATE_PRODUCT_IN_CART_FAIL = '[Cart] UPDATE_PRODUCT_IN_CART Fail';
export const UPDATE_PRODUCT_IN_CART_SUCCESS = '[Cart] UPDATE_PRODUCT_IN_CART Success';

export class UpdateProductInCart implements Action {
  readonly type = UPDATE_PRODUCT_IN_CART;
  constructor(public payload: Item) {}
}

export class UpdateProductInCartFail implements Action {
  readonly type = UPDATE_PRODUCT_IN_CART_FAIL;
  constructor(public payload: any) {}
}

export class UpdateProductInCartSuccess implements Action {
  readonly type = UPDATE_PRODUCT_IN_CART_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

//#region update product quantity
export const UPDATE_PRODUCT_QUANTITY = '[Cart] UPDATE_PRODUCT_QUANTITY';
export const UPDATE_PRODUCT_QUANTITY_FAIL = '[Cart] UPDATE_PRODUCT_QUANTITY Fail';
export const UPDATE_PRODUCT_QUANTITY_SUCCESS = '[Cart] UPDATE_PRODUCT_QUANTITY Success';

export class UpdateProductQuantity implements Action {
  readonly type = UPDATE_PRODUCT_QUANTITY;
  constructor(public payload: Product) {}
}

export class UpdateProductQuantityFail implements Action {
  readonly type = UPDATE_PRODUCT_QUANTITY_FAIL;
  constructor(public payload: any) {}
}

export class UpdateProductQuantitySuccess implements Action {
  readonly type = UPDATE_PRODUCT_QUANTITY_SUCCESS;
  constructor(public payload: Product) {}
}
//#endregion

//#region delete product from cart
export const DELETE_PRODUCT_FROM_CART = '[Cart] DELETE_PRODUCT_FROM_CART';
export const DELETE_PRODUCT_FROM_CART_FAIL = '[Cart] DELETE_PRODUCT_FROM_CART Fail';
export const DELETE_PRODUCT_FROM_CART_SUCCESS = '[Cart] DELETE_PRODUCT_FROM_CART Success';

export class DeleteProductFromCart implements Action {
  readonly type = DELETE_PRODUCT_FROM_CART;
  constructor(public payload:Item) {}
}

export class DeleteProductFromCartFail implements Action {
  readonly type = DELETE_PRODUCT_FROM_CART_FAIL;
  constructor(public payload: any) {}
}

export class DeleteProductFromCartSuccess implements Action {
  readonly type = DELETE_PRODUCT_FROM_CART_SUCCESS;
  constructor(public payload: Item) {}
}
//#endregion

// action types
export type CartAction =
  | GetCart
  | GetCartFail
  | GetCartSuccess

  | AddProductToCart
  | AddProductToCartFail
  | AddProductToCartSuccess

  | AddProductToOrders
  | AddProductToOrdersFail
  | AddProductToOrdersSuccess

  | UpdateProductInCart
  | UpdateProductInCartFail
  | UpdateProductInCartSuccess

  | UpdateProductQuantity
  | UpdateProductQuantityFail
  | UpdateProductQuantitySuccess
  
  | DeleteProductFromCart
  | DeleteProductFromCartFail
  | DeleteProductFromCartSuccess;
