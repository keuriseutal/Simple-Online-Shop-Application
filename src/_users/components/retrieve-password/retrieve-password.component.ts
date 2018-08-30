import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { User } from "../../models/users.model";

@Component({
  selector: 'retrieve-password',
  templateUrl: './retrieve-password.component.html',
  styleUrls: ['./retrieve-password.component.css']
})
export class RetrievePasswordComponent implements OnInit {

  @Input() user: User;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  backToLogIn(){
    this.router.navigate(['/','login']);
  }

}
