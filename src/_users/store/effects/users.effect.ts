import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as userActions from '../actions/users.action';
import * as fromServices from '../../services';

@Injectable()
export class UsersEffects {
  constructor(
    private actions$: Actions,
    private userService: fromServices.UsersService
  ) {}

  @Effect()
  getUsers$ = this.actions$.ofType(userActions.GET_USERS).pipe(
    switchMap(() => {
      return this.userService
        .getUsers()
        .pipe(
          map(users => new userActions.GetUsersSuccess(users)),
          catchError(error => of(new userActions.GetUsersFail(error)))
        );
    })
  );

  @Effect()
  updateUser$ = this.actions$.ofType(userActions.UPDATE_USER).pipe(
    map((action: userActions.UpdateUser) => action.payload),
    switchMap(user => {
      return this.userService
        .updateUser(user)
        .pipe(
          map(user => new userActions.UpdateUserSuccess(user)),
          catchError(error => of(new userActions.UpdateUserFail(error)))
        );
    })
  );

  @Effect()
  addToLoggedUser$ = this.actions$.ofType(userActions.ADD_TO_LOGGEDUSER).pipe(
    map((action: userActions.AddToLoggedUser) => action.payload),
    switchMap(user => {
      return this.userService
        .addToLoggedUser(user)
        .pipe(
          map(user => new userActions.AddToLoggedUserSuccess(user)),
          catchError(error => of(new userActions.AddToLoggedUserFail(error)))
        );
    })
  );

  @Effect()
  deleteFromLoggedUser$ = this.actions$.ofType(userActions.DELETE_FROM_LOGGEDUSER).pipe(
    map((action: userActions.DeleteFromLoggedUser) => action.payload),
    switchMap(user => {
      return this.userService
        .deleteFromLoggedUser(user)
        .pipe(
          map(user => new userActions.DeleteFromLoggedUserSuccess(user)),
          catchError(error => of(new userActions.DeleteFromLoggedUserFail(error)))
        );
    })
  );
}
