import { Component, OnInit, Input } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { User } from "../../models/users.model";

@Component({
  selector: "forgot-password-form",
  templateUrl: "./forgot-password-form.component.html",
  styleUrls: ["./forgot-password-form.component.css"]
})
export class ForgotPasswordFormComponent implements OnInit {
  @Input()
  users: User[];
  @Input()
  user: User;

  unameErrMsg: string = "";
  emailErrMsg: string = "";
  mobileErrMsg: string = "";
  errMsg: string = "";
  isUser: boolean = false;

  form: FormGroup;

  fieldName1: string = "uname";
  fieldValue1: string = "";

  fieldName2: string = "email";
  fieldValue2: string = "";

  fieldName3: string = "mobile";
  fieldValue3: string = "";

  constructor(private router: Router, private location: Location) {}

  ngOnInit() {
    this.form = new FormGroup({
      [this.fieldName1]: new FormControl(this.fieldValue1),
      [this.fieldName2]: new FormControl(this.fieldValue2),
      [this.fieldName3]: new FormControl(this.fieldValue3)
    });
  }

  onGoBack() {
    this.location.back();
  }


  onRetrievePassword(uname, email, mobile) {
    this.fieldValue1 = uname;
    this.fieldValue2 = email;
    this.fieldValue3 = mobile;

    for (let i = 0; i < this.users.length; i++) {
      if (uname == this.users[i].uname && email == this.users[i].email && mobile == this.users[i].mobile) {
        this.user = this.users[i];
        this.isUser = true;
        break;
      } else {
        if (this.fieldValue1.length != 0 && this.fieldValue2.length != 0 && this.fieldValue3.length != 0){
          this.errMsg = "Data is incorrect";
        }else {
          this.errMsg = "";
        }
      }
    }

    if (this.fieldValue1.length == 0) this.unameErrMsg = "Username is required";
    else this.unameErrMsg = "";
    if (this.fieldValue2.length == 0) this.emailErrMsg = "Email is required";
    else this.emailErrMsg = "";
    if (this.fieldValue3.length == 0) this.mobileErrMsg = "Mobile Number is required";
    else this.mobileErrMsg = "";
  }
}
