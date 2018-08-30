import { Injectable } from '@angular/core';

import { Effect, Actions } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

import * as purchasesActions from '../actions/purchases.action';
import * as fromServices from '../../services';

@Injectable()
export class PurchasesEffects {
  constructor(
    private actions$: Actions,
    private purchasesService: fromServices.PurchasesService
  ) {}

  @Effect()
  getPurchases$ = this.actions$.ofType(purchasesActions.GET_PURCHASES).pipe(
    switchMap(() => {
      return this.purchasesService
        .getPurchases()
        .pipe(
          map(purchases => new purchasesActions.GetPurchasesSuccess(purchases)),
          catchError(error => of(new purchasesActions.GetPurchasesFail(error)))
        );
    })
  );

}
