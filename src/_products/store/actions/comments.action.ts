import { Action } from '@ngrx/store';

import { Comment } from '../../models/comments.model';

//#region get comments
export const GET_COMMENTS= '[Cart] GET_COMMENTS';
export const GET_COMMENTS_FAIL = '[Cart] GET_COMMENTS Fail';
export const GET_COMMENTS_SUCCESS = '[Cart] GET_COMMENTS Success';

export class GetComments implements Action {
  readonly type = GET_COMMENTS;
}

export class GetCommentsFail implements Action {
  readonly type = GET_COMMENTS_FAIL;
  constructor(public payload: any) {}
}

export class GetCommentsSuccess implements Action {
  readonly type = GET_COMMENTS_SUCCESS;
  constructor(public payload: Comment[]) {}
}
//#endregion

//#region add comment
export const ADD_COMMENT= '[Cart] ADD_COMMENT';
export const ADD_COMMENT_FAIL = '[Cart] ADD_COMMENT Fail';
export const ADD_COMMENT_SUCCESS = '[Cart] ADD_COMMENT Success';

export class AddComment implements Action {
  readonly type = ADD_COMMENT;
  constructor(public payload: Comment) {}
}

export class AddCommentFail implements Action {
  readonly type = ADD_COMMENT_FAIL;
  constructor(public payload: any) {}
}

export class AddCommentSuccess implements Action {
  readonly type = ADD_COMMENT_SUCCESS;
  constructor(public payload: Comment) {}
}
//#endregion

//#region update comment
export const UPDATE_COMMENT = '[Cart] UPDATE_COMMENT';
export const UPDATE_COMMENT_FAIL = '[Cart] UPDATE_COMMENT Fail';
export const UPDATE_COMMENT_SUCCESS = '[Cart] UPDATE_COMMENT Success';

export class UpdateComment implements Action {
  readonly type = UPDATE_COMMENT;
  constructor(public payload: Comment) {}
}

export class UpdateCommentFail implements Action {
  readonly type = UPDATE_COMMENT_FAIL;
  constructor(public payload: any) {}
}

export class UpdateCommentSuccess implements Action {
  readonly type = UPDATE_COMMENT_SUCCESS;
  constructor(public payload: Comment) {}
}
//#endregion

//#region delete comment
export const DELETE_COMMENT = '[Cart] DELETE_COMMENT';
export const DELETE_COMMENT_FAIL = '[Cart] DELETE_COMMENT Fail';
export const DELETE_COMMENT_SUCCESS = '[Cart] DELETE_COMMENT Success';

export class DeleteComment implements Action {
  readonly type = DELETE_COMMENT;
  constructor(public payload: Comment) {}
}

export class DeleteCommentFail implements Action {
  readonly type = DELETE_COMMENT_FAIL;
  constructor(public payload: any) {}
}

export class DeleteCommentSuccess implements Action {
  readonly type = DELETE_COMMENT_SUCCESS;
  constructor(public payload: Comment) {}
}
//#endregion

// action types
export type CommentsAction =
  | GetComments
  | GetCommentsFail
  | GetCommentsSuccess
  | AddComment
  | AddCommentFail
  | AddCommentSuccess
  | UpdateComment
  | UpdateCommentFail
  | UpdateCommentSuccess
  | DeleteComment
  | DeleteCommentFail
  | DeleteCommentSuccess;
