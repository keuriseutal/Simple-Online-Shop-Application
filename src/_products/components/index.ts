import { NavbarComponent } from "./navbar/navbar.component";

import { DashboardViewerComponent } from "./dashboard-viewer/dashboard-viewer.component";
import { ProductViewerComponent } from "./product-viewer/product-viewer.component";

import { ProfileFormComponent } from "./profile-form/profile-form.component";

import { CartFormComponent } from "./cart-form/cart-form.component";

import { OrdersDisplayComponent } from "./orders-display/orders-display.component";
import { PurchasesDisplayComponent } from "./purchases-display/purchases-display.component";

export const components: any[] = [
  NavbarComponent,
  DashboardViewerComponent,
  ProductViewerComponent,
  ProfileFormComponent,
  CartFormComponent,
  OrdersDisplayComponent,
  PurchasesDisplayComponent
];

export * from "./dashboard-viewer/dashboard-viewer.component";
export * from "./product-viewer/product-viewer.component";
export * from "./navbar/navbar.component";
export * from "./profile-form/profile-form.component";
export * from "./cart-form/cart-form.component";
export * from "./orders-display/orders-display.component";
export * from "./purchases-display/purchases-display.component";
