import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { User } from "../../models/users.model";

@Component({
  selector: "login-form",
  templateUrl: "./login-form.component.html",
  styleUrls: ["./login-form.component.css"]
})
export class LoginFormComponent implements OnInit {
  @Input()
  users: User[];
  @Output()
  loggedUser = new EventEmitter();

  unameErrMsg: string = "";
  passErrMsg: string = "";
  errMsg: string = "";

  form: FormGroup;

  fieldName1: string = "name";
  fieldValue1: string = "";

  fieldName2: string = "pass";
  fieldValue2: string = "";

  constructor(private router: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      [this.fieldName1]: new FormControl(this.fieldValue1),
      [this.fieldName2]: new FormControl(this.fieldValue2)
    });
  }

  onLogIn(uname, pass) {
    this.fieldValue1 = uname;
    this.fieldValue2 = pass;

    for (let i = 0; i < this.users.length; i++) {
      if (uname == this.users[i].uname && pass == this.users[i].pass) {
        this.errMsg = "";
        this.loggedUser.emit(this.users[i]);
        this.router.navigate(['/login/','home']);
        break;
      } else {
        if (this.fieldValue1.length != 0 && this.fieldValue2.length != 0)
          this.errMsg = "Username or password is incorrect";
        else {
          this.errMsg = "";
        }
      }
    }

    if (this.fieldValue1.length == 0) this.unameErrMsg = "Username is required";
    else this.unameErrMsg = "";
    if (this.fieldValue2.length == 0) this.passErrMsg = "Password is required";
    else this.passErrMsg = "";
  }
}
