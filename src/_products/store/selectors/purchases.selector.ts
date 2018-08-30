import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromPurchases from '../reducers/purchases.reducer';

import { Item } from '../../models/items.model';

export const getPurchaseState = createSelector(
  fromFeature.getPurchasesState,
  (state: fromFeature.PurchasesState) => state.purchases
);

export const getPurchaseEntities = createSelector(
  getPurchaseState,
  fromPurchases.getPurchasesEntities
);

export const getSelectedPurchase= createSelector(
  getPurchaseEntities,
  fromRoot.getRouterState,
  (entities, router): Item => {
    return router.state && entities[router.state.params.commentId];
  }
);

export const getAllPurchases = createSelector(getPurchaseEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const getPurchasesLoaded = createSelector(
  getPurchaseState,
  fromPurchases.getPurchasesLoaded
);
export const getPurchasesLoading = createSelector(
  getPurchaseState,
  fromPurchases.getPurchasesLoading
);
