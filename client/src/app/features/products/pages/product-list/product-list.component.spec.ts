import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { of } from 'rxjs';
import { Product } from '../../models/product.model';
import { ReactiveFormsModule } from '@angular/forms';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: Partial<ProductService>;
  let notificationMock: Partial<NotificationService>;

  const mockProducts: Product[] = [
    { id: '1', name: 'Product A', description: 'Desc A', logo: '', date_release: new Date(), date_revision: new Date() },
    { id: '2', name: 'Product B', description: 'Desc B', logo: '', date_release: new Date(), date_revision: new Date() }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getAll: jest.fn().mockReturnValue(of({ data: mockProducts })),
      delete: jest.fn().mockReturnValue(of({ message: 'Deleted' }))
    };

    notificationMock = {
      success: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open create modal', () => {
    component.openCreateModal();
    expect(component.showModal).toBe(true);
    expect(component.modalMode).toBe('form');
    expect(component.isEditMode).toBe(false);
    expect(component.selectedProduct).toBeUndefined();
  });

  it('should open edit modal', () => {
    const product = mockProducts[0];
    component.openEditModal(product);
    expect(component.showModal).toBe(true);
    expect(component.modalMode).toBe('form');
    expect(component.isEditMode).toBe(true);
    expect(component.selectedProduct).toBe(product);
  });

  it('should open delete modal and close menu', () => {
    const product = mockProducts[0];
    component.openMenuId = product.id;
    component.openDeleteModal(product);
    expect(component.showModal).toBe(true);
    expect(component.modalMode).toBe('delete');
    expect(component.selectedProduct).toBe(product);
    expect(component.openMenuId).toBeNull();
  });

  it('should close modal', () => {
    component.showModal = true;
    component.selectedProduct = mockProducts[0];
    component.modalMode = 'form';
    component.closeModal();
    expect(component.showModal).toBe(false);
    expect(component.selectedProduct).toBeUndefined();
    expect(component.modalMode).toBeNull();
  });

  it('should toggle menu', () => {
    component.openMenuId = '1';
    component.toggleMenu('1');
    expect(component.openMenuId).toBeNull();
    component.toggleMenu('2');
    expect(component.openMenuId).toBe('2');
  });

  it('should close menu', () => {
    component.openMenuId = '1';
    component.closeMenu();
    expect(component.openMenuId).toBeNull();
  });

  it('should confirm delete', () => {
    component.selectedProduct = mockProducts[0];
    component.confirmDelete();
    expect(productServiceMock.delete).toHaveBeenCalledWith(mockProducts[0].id);
    expect(notificationMock.success).toHaveBeenCalledWith('Deleted');
  });

  it('should refresh products', () => {
    const spy = jest.spyOn(component, 'refresh');
    component.onSaved();
    expect(spy).toHaveBeenCalled();
    expect(component.showModal).toBe(false);
  });

//   it('should filter products by search term', fakeAsync(() => {
//   component.searchControl.setValue('product a');
  
//   tick(); // simula que el observable de valueChanges emite
  
//   component.products$.subscribe(products => {
//     expect(products.length).toBe(1);
//     expect(products[0].name).toBe('Product A');
//   });
// }));

});
