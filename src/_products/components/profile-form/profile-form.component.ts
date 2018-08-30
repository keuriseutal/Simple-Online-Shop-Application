import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { User } from "../../../_users/models/users.model";

@Component({
  selector: "profile-form",
  templateUrl: "./profile-form.component.html",
  styleUrls: ["./profile-form.component.css"]
})
export class ProfileFormComponent implements OnInit {
  @Input()
  loggedUser: User;
  @Input()
  comments$: Observable<Comment[]>;
  @Input()
  users$: Observable<User[]>;
  users: User[];
  comments: Comment[];
  @Output()
  updatedLoggedUser = new EventEmitter();
  @Output()
  oldUname = new EventEmitter();

  msg: string = "";
  unameErrMsg: string = "";
  fnameErrMsg: string = "";
  mnameErrMsg: string = "";
  lnameErrMsg: string = "";
  emailErrMsg: string = "";
  interestsErrMsg: string = "";

  isUniqueEmail: boolean;
  isUniqueUname: boolean;

  isSuccess: boolean = false;

  constructor(private location: Location) {}

  ngOnInit() {
    this.users$.subscribe(u => (this.users = u));
    this.comments$.subscribe(c => (this.comments = c));
  }

  onGoBack() {
    this.location.back();
  }

  //#region checkers

  checkEmail(email) {
    let emailDomain: string;
    let isCharForDomainExists: boolean; //if @ exists
    //check email contains @
    for (let i = 0; i < email.length; i++) {
      if (email[i] == "@") {
        emailDomain = email.substring(i);
        isCharForDomainExists = true;
        break;
      } else {
        isCharForDomainExists = false;
        continue;
      } //end check if email contains @
    } //end check email LOOP

    if (!isCharForDomainExists) {
      this.emailErrMsg = "Email is invalid";
    }

    //check if domain is @gmail.com
    if (emailDomain == "@gmail.com" && isCharForDomainExists) {
      //check if email is unique
      for (let i = 0; i < this.users.length; i++) {
        if (this.loggedUser.email == email) {
          console.log("old email");
          this.isUniqueEmail = true;
          break;
        } else if (this.users[i].email != email) {
          console.log("valid email");
          this.isUniqueEmail = true;
        } else if (this.users[i].email == email) {
          console.log("existing email");
          this.emailErrMsg = "Email is already registered to another user";
          this.isUniqueEmail = false;
          break;
        } //end check if email is unique or equal the current email of the user
      } //end LOOP - check if email of other users
    } else {
      this.emailErrMsg = "Email is invalid";
      emailDomain = "";
      this.isUniqueEmail = false;
    } //end if domain is not @gmail.com
  } //end checkEmail

  checkUname(uname) {
    //check if username is unique
    for (let i = 0; i < this.users.length; i++) {
      if (this.loggedUser.uname == uname) {
        this.isUniqueUname = true;
        console.log("old uname");
        break;
      } else if (this.users[i].uname != uname) {
        this.isUniqueEmail = true;
        console.log("valid uname");
      } else if (this.users[i].uname == uname) {
        console.log("existing uname");
        this.unameErrMsg = "Username is already registered to another user";
        this.isUniqueUname = false;
        break;
      } //end check if email is unique or equal to the current uname of the user
    } //end LOOP - check if uname of other users
  } //end checkUname

  //#endregion

  onEditProfile(uname, fname, mname, lname, email, bdate, interests) {
    let userOption = window.confirm("You are about to edit you profile");
    if (userOption) {
      this.msg = "";
      //check if fields are empty
      if (uname.length == 0) this.unameErrMsg = "Username is required";
      else this.unameErrMsg = "";
      if (fname.length == 0) this.fnameErrMsg = "First Name is required";
      else this.fnameErrMsg = "";
      if (mname.length == 0) this.mnameErrMsg = "Middle Name is required";
      else this.mnameErrMsg = "";
      if (lname.length == 0) this.lnameErrMsg = "Last Name is required";
      else this.lnameErrMsg = "";
      if (email.length == 0) this.emailErrMsg = "Email is required";
      else this.emailErrMsg = "";
      if (interests.length == 0) this.interestsErrMsg = "Interests is required";
      else this.interestsErrMsg = "";

      if (
        uname.length != 0 &&
        fname.length != 0 &&
        mname.length != 0 &&
        lname.length != 0 &&
        email.length != 0 &&
        interests.length != 0
      ) {
        this.checkEmail(email);
        console.log("email is unique");
        this.checkUname(uname);
        console.log("uname is unique");
        if (this.isUniqueEmail && this.isUniqueUname) {
          //update get previous uname to update author of previous comments
          this.oldUname.emit(this.loggedUser["uname"]);

          //update profile
          this.loggedUser["uname"] = uname;
          this.loggedUser["fname"] = fname;
          this.loggedUser["mname"] = mname;
          this.loggedUser["lname"] = lname;
          this.loggedUser["email"] = email;
          this.loggedUser["interests"] = interests;

          this.updatedLoggedUser.emit(this.loggedUser);
          this.isSuccess = true;
          window.alert("Your profile was updated successfully");
        } //end if email and uname is valid (unique)
      } //end if fields are not empty
    }//if chose to edit profile
  } //end on EditProfile
}
