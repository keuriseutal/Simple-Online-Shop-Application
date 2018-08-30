import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as fromStore from "../../store";
import { User } from "../../models/users.model";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  users$: Observable<User[]>;
  users: User[];

  loggedUser: User;

  constructor(private store: Store<fromStore.UsersState>) { }

  ngOnInit() {
    this.users$ = this.store.select(fromStore.getAllUsers);
    this.store.dispatch(new fromStore.GetUsers());

    //convert from Observable<User[]> to User[]
    this.users$.subscribe(users => (this.users = users));
  }

  setAsLoggedIn(user: User) {

    this.loggedUser = JSON.parse(JSON.stringify(user));
    this.loggedUser.isLoggedIn = true;
    localStorage.setItem('loggedUser', JSON.stringify(this.loggedUser));
    this.store.dispatch(new fromStore.UpdateUser(this.loggedUser));
    console.log("logged In: " + this.loggedUser["uname"] + this.loggedUser["isLoggedIn"]);

  }
}
