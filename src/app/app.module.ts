import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { Routes, RouterModule } from "@angular/router";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from "@angular/forms";
import {
  StoreRouterConnectingModule,
  RouterStateSerializer
} from "@ngrx/router-store";
import { StoreModule, MetaReducer } from "@ngrx/store";
import { EffectsModule } from "@ngrx/effects";

import { reducers, CustomSerializer } from "./store";


// not used in production
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { storeFreeze } from "ngrx-store-freeze";

// this would be done dynamically with webpack for builds
const environment = {
  development: true,
  production: false
};

export const metaReducers: MetaReducer<any>[] = !environment.production
  ? [storeFreeze]
  : [];

// bootstrap
import { AppComponent } from "./containers/app.component";

//material
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule
} from "@angular/material";

// routes
export const ROUTES: Routes = [
  { path: "", pathMatch: "full", redirectTo: "login" },
  {
    path: "login",
    loadChildren: "../_users/users.module#UsersModule"
  }
];

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule,
    environment.development ? StoreDevtoolsModule.instrument() : [],
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule,
    FormsModule
  ],
  exports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCardModule  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  declarations: [AppComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
