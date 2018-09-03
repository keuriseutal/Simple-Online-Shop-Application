import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, mergeMap } from 'rxjs/operators';

import * as commentsActions from '../actions/comments.action';
import * as fromServices from '../../services';

@Injectable()
export class CommentsEffects {
  constructor(
    private actions$: Actions,
    private commentsService: fromServices.CommentsService
  ) {}

  @Effect()
  getComments$ = this.actions$.ofType(commentsActions.GET_COMMENTS).pipe(
    switchMap(() => {
      return this.commentsService
        .getComments()
        .pipe(
          map(comments => new commentsActions.GetCommentsSuccess(comments)),
          catchError(error => of(new commentsActions.GetCommentsFail(error)))
        );
    })
  );

  @Effect()
  addComment$ = this.actions$.ofType(commentsActions.ADD_COMMENT).pipe(
    map((action: commentsActions.AddComment) => action.payload),
    switchMap(comment => {
      return this.commentsService
        .addComment(comment)
        .pipe(
          map(comment => new commentsActions.AddCommentSuccess(comment)),
          catchError(error => of(new commentsActions.AddCommentFail(error)))
        );
    })
  );

  @Effect()
  updateComment$ = this.actions$.ofType(commentsActions.UPDATE_COMMENT).pipe(
    map((action: commentsActions.UpdateComment) => action.payload),
    mergeMap(comment => {
      return this.commentsService
        .updateComment(comment)
        .pipe(
          map(comment => new commentsActions.UpdateCommentSuccess(comment)),
          catchError(error => of(new commentsActions.UpdateCommentFail(error)))
        );
    })
  );

  @Effect()
  deleteComment$ = this.actions$.ofType(commentsActions.DELETE_COMMENT).pipe(
    map((action: commentsActions.DeleteComment) => action.payload),
    switchMap(comment => {
      return this.commentsService
        .deleteComment(comment)
        .pipe(
          map(comment => new commentsActions.DeleteCommentSuccess(comment)),
          catchError(error => of(new commentsActions.DeleteCommentFail(error)))
        );
    })
  );

}
