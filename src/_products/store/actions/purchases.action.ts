import { Action } from '@ngrx/store';

import { Item } from '../../models/items.model';

//#region get purchases
export const GET_PURCHASES = '[Order] Get Purchases';
export const GET_PURCHASES_FAIL = '[Order] Get Purchases sFail';
export const GET_PURCHASES_SUCCESS = '[Order] Get Purchases Success';

export class GetPurchases implements Action {
  readonly type = GET_PURCHASES;
}

export class GetPurchasesFail implements Action {
  readonly type = GET_PURCHASES_FAIL;
  constructor(public payload: any) {}
}

export class GetPurchasesSuccess implements Action {
  readonly type = GET_PURCHASES_SUCCESS;
  constructor(public payload: Item[]) {}
}
//#endregion

// action types
export type PurchasesAction =
  | GetPurchases
  | GetPurchasesFail
  | GetPurchasesSuccess;
