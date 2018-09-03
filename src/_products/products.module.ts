import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { FilterPipe } from './components/filter.pipe';

import { commentReducers, productReducers, cartReducers, ordersReducers, purchasesReducers, effects } from './store'
import { ModalModule } from 'ngx-bootstrap/modal';

// components
import * as fromComponents from './components';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';

// routes
export const ROUTES: Routes = [
  {
    path: '',
    component: fromContainers.DashboardComponent,
  },
  {
    path: 'products',
    component: fromContainers.DashboardComponent,
  },
  {
    path: 'profile',
    component: fromContainers.ProfileComponent,
  },
  {
    path: 'cart',
    component: fromContainers.CartComponent,
  },
  {
    path: 'transactions',
    component: fromContainers.TransactionsComponent,
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(ROUTES),
    StoreModule.forFeature('comments', commentReducers),
    StoreModule.forFeature('products', productReducers),
    
    StoreModule.forFeature('cart', cartReducers),
    StoreModule.forFeature('orders', ordersReducers),
    StoreModule.forFeature('purchases', purchasesReducers),

    EffectsModule.forFeature(effects),
    FormsModule,
    ModalModule.forRoot()
  ],
  providers: [...fromServices.services],
  declarations: [...fromContainers.containers, ...fromComponents.components, FilterPipe],
  exports: [...fromContainers.containers, ...fromComponents.components]
})
export class ProductsModule { }
