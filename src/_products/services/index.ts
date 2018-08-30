import { ProductsService } from "./products.service";
import { CommentsService } from "./comments.service";
import { CartService } from "./cart.service";
import { OrdersService } from "./orders.service";
import { PurchasesService } from "./purchases.service";

export const services: any[] = [
  ProductsService,
  CommentsService,
  CartService,
  OrdersService,
  PurchasesService
];

export * from "./products.service";
export * from "./comments.service";
export * from "./cart.service";
export * from "./orders.service";
export * from "./purchases.service";
