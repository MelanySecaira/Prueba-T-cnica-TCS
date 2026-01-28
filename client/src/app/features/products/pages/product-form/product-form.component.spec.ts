import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { of, throwError } from 'rxjs';
import { Product } from '../../models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: ProductService;
  let notificationService: NotificationService;

  const mockProduct: Product = {
    id: 'P001',
    name: 'Producto Test',
    description: 'Descripción de prueba',
    logo: 'logo.png',
    date_release: new Date('2024-01-01'),
    date_revision: new Date('2025-01-01')
  };

  beforeEach(async () => {
    const productServiceMock = {
      create: jest.fn().mockReturnValue(of({ message: 'Creado', data: mockProduct })),
      update: jest.fn().mockReturnValue(of({ message: 'Actualizado', data: mockProduct }))
    };

    const notificationServiceMock = {
      success: jest.fn(),
      error: jest.fn(),
      warning: jest.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, ProductFormComponent],
      providers: [
        FormBuilder,
        { provide: ProductService, useValue: productServiceMock },
        { provide: NotificationService, useValue: notificationServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    component.ngOnInit();
    expect(component.isEditMode).toBe(false);
    expect(component.form.controls['id'].enabled).toBe(true);
    expect(component.form.valid).toBe(false);
  });

  it('should initialize form in edit mode', () => {
    component.product = mockProduct;
    component.ngOnInit();
    expect(component.isEditMode).toBe(true);
    expect(component.form.controls['id'].disabled).toBe(true);
    expect(component.form.controls['name'].value).toBe(mockProduct.name);
  });

  it('should call create on save in create mode', () => {
    component.ngOnInit();
    component.form.patchValue({
      id: 'P002',
      name: 'Nuevo',
      description: 'Descripción nueva',
      logo: 'logo2.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });

    const savedSpy = jest.spyOn(component.saved, 'emit');
    component.save();
    expect(productService.create).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalledWith('Creado');
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should call update on save in edit mode', () => {
    component.product = mockProduct;
    component.ngOnInit();
    const savedSpy = jest.spyOn(component.saved, 'emit');
    component.save();
    expect(productService.update).toHaveBeenCalled();
    expect(notificationService.success).toHaveBeenCalledWith('Actualizado');
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should show warning if form is invalid', () => {
    component.ngOnInit();
    component.form.controls['name'].setValue(''); // invalid
    component.save();
    expect(notificationService.warning).toHaveBeenCalledWith('Revisa los campos del formulario');
  });

  it('should show error if save fails', () => {
    component.ngOnInit();
    (productService.create as jest.Mock).mockReturnValueOnce(throwError(() => ({ error: { message: 'Error' } })));
    component.form.patchValue({
      id: 'P003',
      name: 'Nuevo',
      description: 'Descripción',
      logo: 'logo3.png',
      date_release: '2024-01-01',
      date_revision: '2025-01-01'
    });
    component.save();
    expect(notificationService.error).toHaveBeenCalledWith('Error');
  });

  it('should reset form', () => {
    component.ngOnInit();
    component.form.patchValue({ name: 'Test' });
    component.resetForm();
    expect(component.form.value.name).toBeNull();
  });

  it('should emit cancel event', () => {
    const cancelSpy = jest.spyOn(component.cancel, 'emit');
    component.onCancel();
    expect(cancelSpy).toHaveBeenCalled();
  });
});
