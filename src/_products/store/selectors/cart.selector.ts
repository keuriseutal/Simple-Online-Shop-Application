import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromCart from '../reducers/cart.reducer';

import { Item } from '../../models/items.model';

export const getCartsState = createSelector(
  fromFeature.getCartState,
  (state: fromFeature.CartsState) => state.cart
);

export const getCartEntities = createSelector(
  getCartsState,
  fromCart.getCartsEntities
);

export const getSelectedCart = createSelector(
  getCartEntities,
  fromRoot.getRouterState,
  (entities, router): Item => {
    return router.state && entities[router.state.params.commentId];
  }
);

export const getAllCart = createSelector(getCartEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const getCartLoaded = createSelector(
  getCartsState,
  fromCart.getCartsLoaded
);
export const getCartLoading = createSelector(
  getCartsState,
  fromCart.getCartsLoading
);
