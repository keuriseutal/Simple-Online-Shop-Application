import * as fromCarts from '../actions/cart.action';
import { Item } from '../../models/items.model';

export interface CartState {
  entities: { [id: number]: Item };
  loaded: boolean;
  loading: boolean;
}

export const initialState: CartState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromCarts.CartAction
): CartState {
  switch (action.type) {
    case fromCarts.GET_CART: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromCarts.GET_CART_SUCCESS: {
      const products = action.payload;
      const entities = products.reduce(
        (entities: { [id: number]: Item }, product: Item) => {
          return {
            ...entities,
            [product.id]: product,
          };
        },
        {
          ...state.entities,
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities,
      };
    }

    case fromCarts.GET_CART_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }

    case fromCarts.UPDATE_PRODUCT_IN_CART_SUCCESS: {
      const cart = action.payload;
      const entities = {
        ...state.entities,
        [cart.id]: cart,
      };

      return {
        ...state,
        entities,
      };
    }
    case fromCarts.ADD_PRODUCT_TO_ORDERS:
    case fromCarts.ADD_PRODUCT_TO_CART_SUCCESS: {
      const cart = action.payload;
      const entities = {
        ...state.entities,
        [cart.id]: cart,
      };

      return {
        ...state,
        entities,
      };
    }

    case fromCarts.DELETE_PRODUCT_FROM_CART_SUCCESS: {
      const cart = action.payload;
      const { [cart.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities,
      };
    }
  }

  return state;
}

export const getCartsEntities = (state: CartState) => state.entities;
export const getCartsLoading = (state: CartState) => state.loading;
export const getCartsLoaded = (state: CartState) => state.loaded;
