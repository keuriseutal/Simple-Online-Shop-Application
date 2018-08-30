import * as fromComments from '../actions/comments.action';
import { Comment } from '../../models/comments.model';

export interface CommentState {
  entities: { [id: number]: Comment };
  loaded: boolean;
  loading: boolean;
}

export const initialState: CommentState = {
  entities: {},
  loaded: false,
  loading: false,
};

export function reducer(
  state = initialState,
  action: fromComments.CommentsAction
): CommentState {
  switch (action.type) {
    case fromComments.GET_COMMENTS: {
      return {
        ...state,
        loading: true,
      };
    }

    case fromComments.GET_COMMENTS_SUCCESS: {
      const products = action.payload;
      const entities = products.reduce(
        (entities: { [id: number]: Comment }, product: Comment) => {
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

    case fromComments.GET_COMMENTS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false,
      };
    }

    case fromComments.UPDATE_COMMENT_SUCCESS: {
      const comment = action.payload;
      const entities = {
        ...state.entities,
        [comment.id]: comment,
      };

      return {
        ...state,
        entities,
      };
    }
    case fromComments.ADD_COMMENT_SUCCESS: {
      const comment = action.payload;
      const entities = {
        ...state.entities,
        [comment.id]: comment,
      };

      return {
        ...state,
        entities,
      };
    }

    case fromComments.DELETE_COMMENT_SUCCESS: {
      const comment = action.payload;
      const { [comment.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities,
      };
    }
  }

  return state;
}

export const getCommentsEntities = (state: CommentState) => state.entities;
export const getCommentsLoading = (state: CommentState) => state.loading;
export const getCommentsLoaded = (state: CommentState) => state.loaded;
