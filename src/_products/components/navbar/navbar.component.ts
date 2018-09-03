import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "navbar-viewer",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  @Output()
  searchInput = new EventEmitter();
  @Output()
  logOut = new EventEmitter();

  constructor(private router: Router) {}

  ngOnInit() {
    
  }

  onInputSearch(input) {
    this.searchInput.emit(input);
  }

  onLogOut() {
    let userOption = window.confirm("You are about to log out");
    if (userOption) {
      this.logOut.emit(true);
      this.router.navigate(["/", "login"]);
    }
  }
}
