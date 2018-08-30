import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromOrders from '../reducers/orders.reducer';

import { Item } from '../../models/items.model';

export const getOrderState = createSelector(
  fromFeature.getOrdersState,
  (state: fromFeature.OrdersState) => state.orders
);

export const getOrdersEntities = createSelector(
  getOrderState,
  fromOrders.getOrdersEntities
);

export const getSelectedOrder = createSelector(
  getOrdersEntities,
  fromRoot.getRouterState,
  (entities, router): Item => {
    return router.state && entities[router.state.params.commentId];
  }
);

export const getAllOrders = createSelector(getOrdersEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const getOrdersLoaded = createSelector(
  getOrderState,
  fromOrders.getOrdersLoaded
);
export const getOrdersLoading = createSelector(
  getOrderState,
  fromOrders.getOrdersLoading
);
