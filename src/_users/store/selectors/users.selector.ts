import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromUsers from '../reducers/users.reducer';

import { User } from '../../models/users.model';

export const getUserState = createSelector(
  fromFeature.getUsersState,
  (state: fromFeature.UsersState) => state.users
);

export const getUsersEntities = createSelector(
  getUserState,
  fromUsers.getUsersEntities
);

export const getSelectedUser = createSelector(
  getUsersEntities,
  fromRoot.getRouterState,
  (entities, router): User => {
    return router.state && entities[router.state.params.userId];
  }
);

export const getAllUsers = createSelector(getUsersEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const getUsersLoaded = createSelector(
  getUserState,
  fromUsers.getUsersLoaded
);
export const getUsersLoading = createSelector(
  getUserState,
  fromUsers.getUsersLoading
);
