import { Action } from '@ngrx/store';

import { Product } from '../../models/products.model';
import { Item } from '../../models/items.model';

// get products
export const GET_PRODUCTS = '[Products] Get Products';
export const GET_PRODUCTS_FAIL = '[Products] Get Products Fail';
export const GET_PRODUCTS_SUCCESS = '[Products] Get Products Success';
// create product
export const ADD_TO_CART = '[Products] Add To Cart';
export const ADD_TO_CART_FAIL = '[Products] Add To Cart Fail';
export const ADD_TO_CART_SUCCESS = '[Products] Add To Cart Success';
// update product
export const UPDATE_PRODUCT = '[Products] Update Product';
export const UPDATE_PRODUCT_FAIL = '[Products] Update Product Fail';
export const UPDATE_PRODUCT_SUCCESS = '[Products] Update Product Success';

export class GetProducts implements Action {
  readonly type = GET_PRODUCTS;
}

export class GetProductsFail implements Action {
  readonly type = GET_PRODUCTS_FAIL;
  constructor(public payload: any) {}
}

export class GetProductsSuccess implements Action {
  readonly type = GET_PRODUCTS_SUCCESS;
  constructor(public payload: Product[]) {}
}


export class UpdateProduct implements Action {
  readonly type = UPDATE_PRODUCT;
  constructor(public payload: Product) {}
}

export class UpdateProductFail implements Action {
  readonly type = UPDATE_PRODUCT_FAIL;
  constructor(public payload: any) {}
}

export class UpdateProductSuccess implements Action {
  readonly type = UPDATE_PRODUCT_SUCCESS;
  constructor(public payload: Product) {}
}

// action types
export type ProductsAction =
  | GetProducts
  | GetProductsFail
  | GetProductsSuccess

  | UpdateProduct
  | UpdateProductFail
  | UpdateProductSuccess;
