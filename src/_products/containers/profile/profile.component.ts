import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
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
  comments: Comment[];
  users$: Observable<User[]>;
  loggedUser: User;

  oldUname: string;

  constructor(
    private commentStore: Store<fromCommentStore.ProductsState>,
    private userStore: Store<fromUserStore.UsersState>
  ) {}

  ngOnInit() {
    //update author of comments when user edits username
    this.comments$ = this.commentStore.select(fromCommentStore.getAllComments);
    this.comments$.subscribe(c => (this.comments = c));
    //to compare username and email from other users -- edited username and email must be unique
    this.users$ = this.userStore.select(fromUserStore.getAllUsers);

    this.loggedUser = JSON.parse(localStorage.getItem("loggedUser"));
  }

  setAsLoggedOut(event) {

    let user = this.loggedUser;
    user.isLoggedIn = false;
    this.userStore.dispatch(new fromUserStore.UpdateUser(user));

    console.log("logged Out: " + user["uname"] + user["isLoggedIn"]);
    localStorage.removeItem("loggedUser");

  }

  updateUserProfile(event: User) {
    localStorage.setItem("loggedUser", JSON.stringify(event));

    this.userStore.dispatch(new fromUserStore.UpdateUser(event));
    console.log("update: " + event["uname"] + event["isLoggedIn"]);

    for (let i = 0; i < this.comments.length; i++) {
      console.log("author: " + this.comments[i].author);
      if (this.comments[i].author == this.oldUname) {
        console.log(
          "oldUname: " + this.oldUname + " newUname: " + event["uname"]
        );
        this.comments[i].author = event.uname;
        this.commentStore.dispatch(
          new fromCommentStore.UpdateComment(this.comments[i])
        );
        continue;
      } else {
        continue;
      }
    }
    console.log("update comments DONE");
  }

  updatePreviousComments(event: string) {
    this.oldUname = event;
  }
}
