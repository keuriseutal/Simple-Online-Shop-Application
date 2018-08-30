import { ActionReducerMap, createFeatureSelector } from '@ngrx/store';

import * as fromComments from './comments.reducer';
import * as fromProducts from './products.reducer';
import * as fromCart from './cart.reducer';
import * as fromOrders from './orders.reducer';
import * as fromPurchases from './purchases.reducer';

export interface ProductsState {
  products: fromProducts.ProductState;
}

export interface CommentsState {
  comments: fromComments.CommentState;
}

export interface CartsState {
  cart: fromCart.CartState;
}

export interface OrdersState {
  orders: fromOrders.OrderState;
}

export interface PurchasesState {
  purchases: fromPurchases.PurchaseState;
}

export const productReducers: ActionReducerMap<ProductsState> = {
  products: fromProducts.reducer,
};

export const commentReducers: ActionReducerMap<CommentsState> = {
  comments: fromComments.reducer,
};

export const cartReducers: ActionReducerMap<CartsState> = {
  cart: fromCart.reducer,
};

export const ordersReducers: ActionReducerMap<OrdersState> = {
  orders: fromOrders.reducer,
};

export const purchasesReducers: ActionReducerMap<PurchasesState> = {
  purchases: fromPurchases.reducer,
};

export const getProductsState = createFeatureSelector<ProductsState>(
  'products'
);

export const getCommentsState = createFeatureSelector<CommentsState>(
  'comments'
);

export const getCartState = createFeatureSelector<CartsState>(
  'cart'
);

export const getOrdersState = createFeatureSelector<OrdersState>(
  'orders'
);

export const getPurchasesState = createFeatureSelector<PurchasesState>(
  'purchases'
);
