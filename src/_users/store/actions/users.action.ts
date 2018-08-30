import { Action } from "@ngrx/store";

import { User } from "../../models/users.model";

//#region get Users
export const GET_USERS = "[Users] Get Users";
export const GET_USERS_SUCCESS = "[Users] Get Users Success";
export const GET_USERS_FAIL = "[Users] Get Users Fail";

export class GetUsers implements Action {
  readonly type = GET_USERS;
}

export class GetUsersFail implements Action {
  readonly type = GET_USERS_FAIL;
  constructor(public payload: any) {}
}

export class GetUsersSuccess implements Action {
  readonly type = GET_USERS_SUCCESS;
  constructor(public payload: User[]) {}
}
//#endregion

//#region update User
export const UPDATE_USER = "[Users] Update User";
export const UPDATE_USER_SUCCESS = "[Users] Update User Success";
export const UPDATE_USER_FAIL = "[Users] Update User Fail";

export class UpdateUser implements Action {
  readonly type = UPDATE_USER;
  constructor(public payload: User) {}
}

export class UpdateUserFail implements Action {
  readonly type = UPDATE_USER_FAIL;
  constructor(public payload: any) {}
}

export class UpdateUserSuccess implements Action {
  readonly type = UPDATE_USER_SUCCESS;
  constructor(public payload: User) {}
}
//#endregion

//#region add user to loggedUser
export const ADD_TO_LOGGEDUSER = '[User] ADD_TO_LOGGEDUSER';
export const ADD_TO_LOGGEDUSER_FAIL = '[User] ADD_TO_LOGGEDUSER Fail';
export const ADD_TO_LOGGEDUSER_SUCCESS = '[User] ADD_TO_LOGGEDUSER Success';

export class AddToLoggedUser implements Action {
  readonly type = ADD_TO_LOGGEDUSER;
  constructor(public payload: User) {}
}

export class AddToLoggedUserFail implements Action {
  readonly type = ADD_TO_LOGGEDUSER_FAIL;
  constructor(public payload: any) {}
}

export class AddToLoggedUserSuccess implements Action {
  readonly type = ADD_TO_LOGGEDUSER_SUCCESS;
  constructor(public payload: User) {}
}
//#endregion

//#region delete user from loggedUser
export const DELETE_FROM_LOGGEDUSER = '[User] DELETE_FROM_LOGGEDUSER';
export const DELETE_FROM_LOGGEDUSER_FAIL = '[User] DELETE_FROM_LOGGEDUSER Fail';
export const DELETE_FROM_LOGGEDUSER_SUCCESS = '[User] DELETE_FROM_LOGGEDUSER Success';

export class DeleteFromLoggedUser implements Action {
  readonly type = DELETE_FROM_LOGGEDUSER;
  constructor(public payload: User) {}
}

export class DeleteFromLoggedUserFail implements Action {
  readonly type = DELETE_FROM_LOGGEDUSER_FAIL;
  constructor(public payload: any) {}
}

export class DeleteFromLoggedUserSuccess implements Action {
  readonly type = DELETE_FROM_LOGGEDUSER_SUCCESS;
  constructor(public payload: User) {}
}
//#endregion

// action types
export type UsersAction =
  | GetUsers
  | GetUsersFail
  | GetUsersSuccess
  | UpdateUser
  | UpdateUserFail
  | UpdateUserSuccess
  | AddToLoggedUser
  | AddToLoggedUserFail
  | AddToLoggedUserSuccess
  | DeleteFromLoggedUser
  | DeleteFromLoggedUserFail
  | DeleteFromLoggedUserSuccess;
