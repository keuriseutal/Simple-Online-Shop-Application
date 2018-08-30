import { DashboardComponent } from "./dashboard/dashboard.component";
import { ProfileComponent } from "./profile/profile.component";
import { CartComponent } from "./cart/cart.component";
import { TransactionsComponent } from "./transactions/transactions.component";

export const containers: any[] = [DashboardComponent, ProfileComponent, CartComponent, TransactionsComponent];

export * from "./dashboard/dashboard.component";
export * from "./profile/profile.component";
export * from "./cart/cart.component";
export * from "./transactions/transactions.component";
