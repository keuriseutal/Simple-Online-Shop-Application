import * as fromProducts from '../actions/products.action';
import { Product } from '../../models/products.model';

export interface ProductState {
  entities: { [id: number]: Product };
  loaded: boolean;
  loading: boolean;
}

export const initialState: ProductState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromProducts.ProductsAction
): ProductState {
  switch (action.type) {
    case fromProducts.GET_PRODUCTS: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromProducts.GET_PRODUCTS_SUCCESS: {
      const products = action.payload;
      const entities = products.reduce(
        (entities: { [id: number]: Product }, product: Product) => {
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

    case fromProducts.GET_PRODUCTS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }

    case fromProducts.UPDATE_PRODUCT_SUCCESS: {
      const product = action.payload;
      const entities = {
        ...state.entities,
        [product.id]: product,
      };

      return {
        ...state,
        entities,
      };
    }
  }

  return state;
}

export const getProductsEntities = (state: ProductState) => state.entities;
export const getProductsLoading = (state: ProductState) => state.loading;
export const getProductsLoaded = (state: ProductState) => state.loaded;
