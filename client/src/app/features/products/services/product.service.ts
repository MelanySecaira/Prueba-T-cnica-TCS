import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, catchError, of } from 'rxjs';
import { DeleteResponse, Product, ProductListResponse, ProductResponse } from '../models/product.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private readonly apiUrl = 'http://localhost:3002/bp/products';

  private productsSubject = new BehaviorSubject<Product[]>([]);
  products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadProducts(): void {
    this.getAll().pipe(
      map(response => response.data)
    ).subscribe(products => {
      this.productsSubject.next(products);
    });
  }


  getAll() : Observable<ProductListResponse> {
  return this.http.get<ProductListResponse>(this.apiUrl);
  }

  // getById(id: number): Observable<Product> {
  //   return this.http.get<Product>(`${this.apiUrl}/${id}`);
  // }

  checkIdExists(id: string): Observable<boolean> {
  return this.http.get<{ exists: boolean }>(
    `${this.apiUrl}/${id}`,
    {
      headers: {
        'X-Skip-Error': 'true'
      }
    }
  ).pipe(
    map(() => true),
    catchError(() => of(false)) 
  );
}



  create(product: Product) {
  return this.http.post<ProductResponse>(
    this.apiUrl,
    product
  );
}

  update(product: Product) {
  return this.http.put<ProductResponse>(
    `${this.apiUrl}/${product.id}`,
    product
  );
}


  delete(id: string): Observable<DeleteResponse> {
    return this.http.delete<DeleteResponse>(`${this.apiUrl}/${id}`);
  }

}
