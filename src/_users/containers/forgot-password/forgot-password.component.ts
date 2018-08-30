import { Component, OnInit } from '@angular/core';

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import * as fromStore from "../../store";
import { User } from "../../models/users.model";

@Component({
  selector: 'forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  users$: Observable<User[]>;
  users: User[];

  constructor(private store: Store<fromStore.UsersState>) {}

  ngOnInit() {
    this.users$ = this.store.select(fromStore.getAllUsers);
    this.store.dispatch(new fromStore.GetUsers());
    this.users$.subscribe(users => this.users = users);

  }

}
