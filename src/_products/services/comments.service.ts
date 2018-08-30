import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable } from "rxjs";
import { catchError } from "rxjs/operators";

import { Comment } from "../models/comments.model";

const COMMENTS_API: string = 'http://localhost:3000/comments';

@Injectable()
export class CommentsService {
  constructor(private http: HttpClient) { }

   getComments(): Observable<Comment[]> {
    return this.http
      .get<Comment[]>(COMMENTS_API)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  addComment(payload: Comment): Observable<Comment> {
    return this.http
      .post<Comment>(COMMENTS_API, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  updateComment(payload: Comment): Observable<Comment> {
    return this.http
      .put<Comment>(`${COMMENTS_API}/${payload.id}`, payload)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

  deleteComment(payload: Comment): Observable<Comment> {
    return this.http
      .delete<any>(`${COMMENTS_API}/${payload.id}`)
      .pipe(catchError((error: any) => Observable.throw(error.json())));
  }

}
