import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SalesService } from '../../services/sales.service';
import * as SalesActions from './sales.actions';

@Injectable()
export class SalesEffects {
  private actions$ = inject(Actions);
  private salesService = inject(SalesService);

  // Load Sales Records Effect
  loadSalesRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSalesRecords),
      mergeMap(({ query }) =>
        this.salesService.getSalesRecords(query).pipe(
          map((response) =>
            SalesActions.loadSalesRecordsSuccess({
              data: response.data,
              total: response.total,
              limit: response.limit,
              offset: response.offset,
            })
          ),
          catchError((error) =>
            of(SalesActions.loadSalesRecordsFailure({ error }))
          )
        )
      )
    )
  );

  // Load More Sales Records Effect
  loadMoreSalesRecords$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadMoreSalesRecords),
      mergeMap(({ query }) =>
        this.salesService.getSalesRecords(query).pipe(
          map((response) =>
            SalesActions.loadMoreSalesRecordsSuccess({
              data: response.data,
              total: response.total,
              limit: response.limit,
              offset: response.offset,
            })
          ),
          catchError((error) =>
            of(SalesActions.loadMoreSalesRecordsFailure({ error }))
          )
        )
      )
    )
  );

  // Jump To Offset Effect
  jumpToOffset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.jumpToOffset),
      mergeMap(({ offset, query }) => {
        const jumpQuery = {
          ...query,
          offset: offset,
          limit: 20, // Load 20 records from the new offset
        };

        return this.salesService.getSalesRecords(jumpQuery).pipe(
          map((response) =>
            SalesActions.loadSalesRecordsSuccess({
              data: response.data,
              total: response.total,
              limit: response.limit,
              offset: response.offset,
            })
          ),
          catchError((error) =>
            of(SalesActions.loadSalesRecordsFailure({ error }))
          )
        );
      })
    )
  );

  // Load Sales Summary Effect
  loadSalesSummary$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSalesSummary),
      switchMap(() =>
        this.salesService.getSalesSummary().pipe(
          map((summary) => SalesActions.loadSalesSummarySuccess({ summary })),
          catchError((error) =>
            of(SalesActions.loadSalesSummaryFailure({ error }))
          )
        )
      )
    )
  );

  // Load Sales By Region Effect
  loadSalesByRegion$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSalesByRegion),
      switchMap(() =>
        this.salesService.getSalesByRegion().pipe(
          map((data) => SalesActions.loadSalesByRegionSuccess({ data })),
          catchError((error) =>
            of(SalesActions.loadSalesByRegionFailure({ error }))
          )
        )
      )
    )
  );

  // Load Sales By Item Type Effect
  loadSalesByItemType$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSalesByItemType),
      switchMap(() =>
        this.salesService.getSalesByItemType().pipe(
          map((data) => SalesActions.loadSalesByItemTypeSuccess({ data })),
          catchError((error) =>
            of(SalesActions.loadSalesByItemTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Auto-load records when filters change
  loadRecordsOnFilterChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.setFilters, SalesActions.clearFilters),
      mergeMap((action) => {
        const query =
          action.type === '[Sales] Set Filters' ? (action as any).filters : {};

        return of(SalesActions.loadSalesRecords({ query }));
      })
    )
  );

  // Auto-load records when page changes
  loadRecordsOnPageChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.setCurrentPage, SalesActions.setPageSize),
      mergeMap(() => of(SalesActions.loadSalesRecords({ query: {} })))
    )
  );
}
