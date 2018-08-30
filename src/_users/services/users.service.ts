import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { User } from "../models/users.model";

const USERS_API = "http://localhost:3000/users";
const LOGGEDUSER_API = "http://localhost:3000/loggedUser";

@Injectable()
export class UsersService {
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<User[]>(USERS_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateUser(payload: User): Observable<User> {
    return this.http
      .put<User>(`${USERS_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  addToLoggedUser(payload: User): Observable<User> {
    return this.http
      .post<User>(LOGGEDUSER_API, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  deleteFromLoggedUser(payload: User): Observable<User> {
    return this.http
      .delete<User>(`${LOGGEDUSER_API}/${payload.id}`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }
}
