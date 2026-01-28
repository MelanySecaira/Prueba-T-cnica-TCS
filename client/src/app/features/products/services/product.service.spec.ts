// import { TestBed } from '@angular/core/testing';
// import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
// import { ProductService } from './product.service';
// import { Product, ProductListResponse, ProductResponse, DeleteResponse } from '../models/product.model';

// describe('ProductService', () => {
//   let service: ProductService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [HttpClientTestingModule], 
//       providers: [ProductService]
//     });
//     service = TestBed.inject(ProductService);
//   });

 
// });

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductListResponse, ProductResponse, DeleteResponse } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load products into products$', () => {
    const mockResponse: ProductListResponse = {
      data: [{ id: '1', name: 'Test', description: '', logo: '', date_release: new Date(), date_revision: new Date() }]
    };

    service.loadProducts();
    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);

    service.products$.subscribe(products => {
      expect(products.length).toBe(1);
      expect(products[0].name).toBe('Test');
    });
  });

  it('should return all products with getAll', () => {
    const mockResponse: ProductListResponse = {
      data: [{ id: '1', name: 'Test', description: '', logo: '', date_release: new Date(), date_revision: new Date() }]
    };

    service.getAll().subscribe(res => {
      expect(res.data.length).toBe(1);
      expect(res.data[0].name).toBe('Test');
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return true when checkIdExists succeeds', () => {
    service.checkIdExists('1').subscribe(exists => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/1');
    expect(req.request.method).toBe('GET');
    req.flush({ exists: true });
  });

  it('should return false when checkIdExists fails', () => {
    service.checkIdExists('999').subscribe(exists => {
      expect(exists).toBe(false);
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products/999');
    req.error(new ErrorEvent('Not Found'));
  });

  it('should create a product', () => {
    const newProduct: Product = { id: '2', name: 'New', description: '', logo: '', date_release: new Date(), date_revision: new Date() };
    const mockResponse: ProductResponse = { message: 'Created', data: newProduct };

    service.create(newProduct).subscribe(res => {
      expect(res.data.id).toBe('2');
      expect(res.message).toBe('Created');
    });

    const req = httpMock.expectOne('http://localhost:3002/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const updatedProduct: Product = { id: '2', name: 'Updated', description: '', logo: '', date_release: new Date(), date_revision: new Date() };
    const mockResponse: ProductResponse = { message: 'Updated', data: updatedProduct };

    service.update(updatedProduct).subscribe(res => {
      expect(res.data.name).toBe('Updated');
    });

    const req = httpMock.expectOne(`http://localhost:3002/bp/products/2`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockResponse);
  });

  it('should delete a product', () => {
    const mockResponse: DeleteResponse = { message: 'Deleted' };

    service.delete('2').subscribe(res => {
      expect(res.message).toBe('Deleted');
    });

    const req = httpMock.expectOne(`http://localhost:3002/bp/products/2`);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });
});
