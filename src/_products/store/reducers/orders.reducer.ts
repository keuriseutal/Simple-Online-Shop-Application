import * as fromOrders from "../actions/orders.action";
import { Item } from "../../models/items.model";

export interface OrderState {
  entities: { [id: number]: Item };
  loaded: boolean;
  loading: boolean;
}

export const initialOrderState: OrderState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialOrderState,
  action: fromOrders.OrdersAction
): OrderState {
  switch (action.type) {
    case fromOrders.GET_ORDERS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromOrders.GET_ORDERS_SUCCESS: {
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

    case fromOrders.GET_ORDERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    case fromOrders.UPDATE_PRODUCT_IN_ORDERS:
    case fromOrders.ADD_PRODUCT_TO_PURCHASES: {
      const product = action.payload;
      const entities = {
        ...state.entities,
        [product.id]: product
      };

      return {
        ...state,
        entities
      };
    }

    case fromOrders.DELETE_PRODUCT_FROM_ORDERS_SUCCESS: {
      const comment = action.payload;
      const { [comment.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities
      };
    }
  }

  return state;
}

export const getOrdersEntities = (state: OrderState) => state.entities;
export const getOrdersLoading = (state: OrderState) => state.loading;
export const getOrdersLoaded = (state: OrderState) => state.loaded;
