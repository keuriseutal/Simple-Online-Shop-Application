import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as fromUserStore from "../../../_users/store";
import * as fromCommentStore from "../../store";

import { Comment } from "../../models/comments.model";
import { User } from "../../../_users/models/users.model";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: "profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  comments$: Observable<Comment[]>;
  users$: Observable<User[]>;
  loggedUser: User;
  comments: Comment[];
  oldUname: string;
  constructor(
    private commentStore: Store<fromCommentStore.ProductsState>,
    private userStore: Store<fromUserStore.UsersState>
  ) {}

  ngOnInit() {
    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
    this.oldUname = this.loggedUser.uname;
    console.log(this.oldUname);
    //to compare username and email from other users -- edited username and email must be unique
    this.users$ = this.userStore.select(fromUserStore.getAllUsers);
    this.comments$ = this.commentStore
    .select(fromCommentStore.getAllComments)
    .pipe(map(comments => comments.filter(c => this.oldUname == c.author)));
  this.commentStore.dispatch(new fromCommentStore.GetComments());
  
  }

  setAsLoggedOut(event) {
    let user = this.loggedUser;
    user.isLoggedIn = false;
    this.userStore.dispatch(new fromUserStore.UpdateUser(user));

    console.log("logged Out: " + user["uname"] + user["isLoggedIn"]);
    localStorage.removeItem("loggedUser");
  }

  updateUserProfile(event: User) {
    //updateComments
    this.comments$.subscribe(c => (this.comments = c));
    for (let i = 0; i < this.comments.length; i++) {
      let newComment: Comment = {
        id:this.comments[i].id,
        productId: this.comments[i].productId,
        msg: this.comments[i].msg,
        author: event.uname,
        date: this.comments[i].date
      };
      this.commentStore.dispatch(
        new fromCommentStore.UpdateComment(newComment)
      );
    }
    window.alert("Previous comments were updated successfully");
    
    //update profile
    localStorage.setItem("loggedUser", JSON.stringify(event));
    this.userStore.dispatch(new fromUserStore.UpdateUser(event));
  }

}
