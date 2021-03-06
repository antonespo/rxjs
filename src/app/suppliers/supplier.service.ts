import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { throwError, Observable, of, from } from 'rxjs';
import { Supplier } from './supplier';
import {
  catchError,
  concatMap,
  expand,
  filter,
  map,
  mergeMap,
  scan,
  shareReplay,
  switchMap,
  tap,
  toArray,
} from 'rxjs/operators';
import { ProductService } from '../products/product.service';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  suppliersUrl = 'api/suppliers';

  constructor(
    private http: HttpClient,
    private productService: ProductService
  ) {}

  suppliers$ = this.productService.selectedProduct$.pipe(
    filter((product) => !!product),
    map((product) => product.supplierIds),
    switchMap((ids) =>
      from(ids).pipe(
        mergeMap((id) => this.http.get<Supplier>(`${this.suppliersUrl}/${id}`)),
        toArray()
      )
    )
  );

  // suppliers$ = this.http.get<Supplier[]>(this.suppliersUrl).pipe(
  //   shareReplay(1),
  //   catchError(this.handleError)
  // )

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
