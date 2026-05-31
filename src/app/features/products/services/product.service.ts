import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, tap } from 'rxjs';
import { ApplicationError, ErrorHandlerService } from '../../../shared';
import { ProductApiItem, ProductApiMutationResponse, ProductApiResponse, ProductApiDeleteResponse } from '../models/product-api.model';
import { Product } from '../models/product.model';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:3002/bp/products';
  private readonly productsState = signal<readonly Product[]>([]);
  private readonly loadingState = signal(false);

  public readonly products = this.productsState.asReadonly();
  public readonly loading = this.loadingState.asReadonly();

  constructor(
    private readonly http: HttpClient,
    private readonly errorHandler: ErrorHandlerService
  ) {}

  public loadProducts(): void {
    this.loadingState.set(true);

    this.http
      .get<ProductApiResponse>(this.apiUrl)
      .pipe(
        map(response => ProductMapper.toProducts(response.data ?? [])),
        catchError(error => {
          this.errorHandler.handleError(
            new ApplicationError(
              'PRODUCTS_LOAD_FAILED',
              'No fue posible obtener los productos desde el servicio.',
              error
            )
          );
          return of([] as Product[]);
        }),
        finalize(() => this.loadingState.set(false))
      )
      .subscribe(products => this.productsState.set(products));
  }

  public addProduct(product: Product): void {
    this.productsState.update(products => [product, ...products]);
  }

  public verifyId(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/verification/${encodeURIComponent(id)}`;
    return this.http.get<boolean>(url).pipe(
      catchError(() => of(false))
    );
  }

  public createProduct(apiItem: ProductApiItem): Observable<Product> {
    return this.http.post<ProductApiMutationResponse>(this.apiUrl, apiItem).pipe(
      map(created => {
        const product = ProductMapper.toProduct(created.data);
        this.addProduct(product);
        return product;
      }),
      catchError(error => {
        this.errorHandler.handleError(
          new ApplicationError(
            'PRODUCT_CREATE_FAILED',
            'No fue posible crear el producto en el servicio.',
            error
          )
        );
        return of(null as unknown as Product);
      })
    );
  }

  public updateProduct(id: string, apiItem: Omit<ProductApiItem, 'id'>): Observable<Product> {
    const url = `${this.apiUrl}/${encodeURIComponent(id)}`;

    return this.http.put<ProductApiMutationResponse>(url, apiItem).pipe(
      map(updated => {
        const product = ProductMapper.toProduct(updated.data);
        this.productsState.update(products =>
          products.map(current => (current.id === product.id ? product : current))
        );
        return product;
      }),
      catchError(error => {
        this.errorHandler.handleError(
          new ApplicationError(
            'PRODUCT_UPDATE_FAILED',
            'No fue posible actualizar el producto en el servicio.',
            error
          )
        );
        return of(null as unknown as Product);
      })
    );
  }

  public deleteProduct(id: string): Observable<boolean> {
    const url = `${this.apiUrl}/${encodeURIComponent(id)}`;

    return this.http.delete<ProductApiDeleteResponse>(url).pipe(
      tap(() => {
        this.productsState.update(products => products.filter(product => product.id !== id));
      }),
      map(() => true),
      catchError(error => {
        const errorMessage = error?.error?.message || 'No fue posible eliminar el producto en el servicio.';
        this.errorHandler.handleError(
          new ApplicationError(
            'PRODUCT_DELETE_FAILED',
            errorMessage,
            error
          )
        );
        return of(false);
      })
    );
  }

  public getNextId(): string {
    const numericIds = this.productsState()
      .map(product => Number(product.id))
      .filter(id => Number.isFinite(id));

    const nextId = numericIds.length ? Math.max(...numericIds) + 1 : 1;
    return String(nextId);
  }
}
