import { ProductsEffects } from './products.effect';
import { CommentsEffects } from './comments.effect';
import { CartEffects } from './cart.effect';
import { OrdersEffects } from './orders.effect';
import { PurchasesEffects } from './purchases.effect';

export const effects: any[] = [ProductsEffects, CommentsEffects, CartEffects, OrdersEffects, PurchasesEffects];

export * from './products.effect';
export * from './comments.effect';
export * from './cart.effect';
export * from './orders.effect';
export * from './purchases.effect';
