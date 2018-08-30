import * as fromPurchases from "../actions/purchases.action";
import { Item } from "../../models/items.model";

export interface PurchaseState {
  entities: { [id: number]: Item };
  loaded: boolean;
  loading: boolean;
}

export const initialPurchaseState: PurchaseState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialPurchaseState,
  action: fromPurchases.PurchasesAction
): PurchaseState {
  switch (action.type) {
    case fromPurchases.GET_PURCHASES: {
      return {
        ...state,
        loading: true
      };
    }

    case fromPurchases.GET_PURCHASES_SUCCESS: {
      const products = action.payload;
      const entities = products.reduce(
        (entities: { [id: number]: Item }, product: Item) => {
          return {
            ...entities,
            [product.id]: product
          };
        },
        {
          ...state.entities
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromPurchases.GET_PURCHASES_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
  }

  return state;
}

export const getPurchasesEntities = (state: PurchaseState) => state.entities;
export const getPurchasesLoading = (state: PurchaseState) => state.loading;
export const getPurchasesLoaded = (state: PurchaseState) => state.loaded;
