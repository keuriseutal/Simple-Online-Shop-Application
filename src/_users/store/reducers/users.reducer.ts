import * as fromUsers from "../actions/users.action";
import { User } from "../../models/users.model";

export interface UserState {
  entities: { [id: number]: User };
  loaded: boolean;
  loading: boolean;
}

export const initialState: UserState = {
  entities: {},
  loaded: false,
  loading: false
};

export function reducer(
  state = initialState,
  action: fromUsers.UsersAction
): UserState {
  switch (action.type) {

    //#region get users
    case fromUsers.GET_USERS: {
      return {
        ...state,
        loading: true
      };
    }

    case fromUsers.GET_USERS_SUCCESS: {
      const users = action.payload;

      const entities = users.reduce(
        (entities: { [id: number]: User }, user: User) => {
          return {
            ...entities,
            [user.id]: user
          };
        },
        {
          ...state.entities
        }
      );

      return {
        ...state,
        loading: false,
        loaded: true,
        entities
      };
    }

    case fromUsers.GET_USERS_FAIL: {
      return {
        ...state,
        loading: false,
        loaded: false
      };
    }
    //#endregion

    //#region add user to loggedUser and update user
    case fromUsers.ADD_TO_LOGGEDUSER_SUCCESS:
    case fromUsers.UPDATE_USER_SUCCESS: {
      const user = action.payload;
      const entities = {
        ...state.entities,
        [user.id]: user
      };

      return {
        ...state,
        entities
      };
    }
    //#endregion

    //#region delete user from loggedUser
    case fromUsers.DELETE_FROM_LOGGEDUSER_SUCCESS: {
      const user = action.payload;
      const { [user.id]: removed, ...entities } = state.entities;

      return {
        ...state,
        entities,
      };
    }
  }
  //#endregiom
  return state;

}

export const getUsersEntities = (state: UserState) => state.entities;
export const getUsersLoading = (state: UserState) => state.loading;
export const getUsersLoaded = (state: UserState) => state.loaded;
