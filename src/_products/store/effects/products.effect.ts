import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as productsActions from '../actions/products.action';
import * as fromServices from '../../services';

@Injectable()
export class ProductsEffects {
  constructor(
    private actions$: Actions,
    private productsService: fromServices.ProductsService
  ) {}

  @Effect()
  getProducts$ = this.actions$.ofType(productsActions.GET_PRODUCTS).pipe(
    switchMap(() => {
      return this.productsService
        .getProducts()
        .pipe(
          map(products => new productsActions.GetProductsSuccess(products)),
          catchError(error => of(new productsActions.GetProductsFail(error)))
        );
    })
  );


  @Effect()
  updateProduct$ = this.actions$.ofType(productsActions.UPDATE_PRODUCT).pipe(
    map((action: productsActions.UpdateProduct) => action.payload),
    switchMap(product => {
      return this.productsService
        .updateProduct(product)
        .pipe(
          map(product => new productsActions.UpdateProductSuccess(product)),
          catchError(error => of(new productsActions.UpdateProductFail(error)))
        );
    })
  );

}
