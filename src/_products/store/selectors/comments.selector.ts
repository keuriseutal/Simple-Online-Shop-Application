import { createSelector } from '@ngrx/store';

import * as fromRoot from '../../../app/store';
import * as fromFeature from '../reducers';
import * as fromComments from '../reducers/comments.reducer';

import { Comment } from '../../models/comments.model';

export const getCommentState = createSelector(
  fromFeature.getCommentsState,
  (state: fromFeature.CommentsState) => state.comments
);

export const getCommentsEntities = createSelector(
  getCommentState,
  fromComments.getCommentsEntities
);

export const getSelectedComment = createSelector(
  getCommentsEntities,
  fromRoot.getRouterState,
  (entities, router): Comment => {
    return router.state && entities[router.state.params.commentId];
  }
);

export const getAllComments = createSelector(getCommentsEntities, entities => {
  return Object.keys(entities).map(id => entities[parseInt(id, 10)]);
});

export const getCommentsLoaded = createSelector(
  getCommentState,
  fromComments.getCommentsLoaded
);
export const getCommentsLoading = createSelector(
  getCommentState,
  fromComments.getCommentsLoading
);
