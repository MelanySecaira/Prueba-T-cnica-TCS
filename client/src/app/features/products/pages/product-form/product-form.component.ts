import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { minTodayDate, revisionOneYearAfter } from '../../validators/date.validators';
import { uniqueProductIdValidator } from '../../validators/unique-id.validator';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent {
  @Input() product?: Product;
  @Output() saved = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  form!: FormGroup;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private notification: NotificationService

  ) {}

  

  ngOnInit(): void {
    this.isEditMode = !!this.product;

    this.form = this.fb.group({
      id: [
        { value: this.product?.id || '', disabled: this.isEditMode },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10)
        ],
        this.isEditMode ? [] : [uniqueProductIdValidator(this.productService)]
      ],
      name: [
        this.product?.name || '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(100)]
      ],
      description: [
        this.product?.description || '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(200)]
      ],
      logo: [
        this.product?.logo || '',
        Validators.required
      ],
      date_release: [
        this.product?.date_release || '',
        [Validators.required, minTodayDate]
      ],
      date_revision: [
  this.product?.date_revision || '', 
  [Validators.required, revisionOneYearAfter('date_release')]
]

    });

    this.form.get('date_release')?.valueChanges.subscribe((value) => {
  if (!value) return;

  const releaseDate = new Date(value);
  const revisionDate = new Date(releaseDate);
  revisionDate.setFullYear(revisionDate.getFullYear() + 1);

  const formattedDate = revisionDate.toISOString().split('T')[0];

  this.form.get('date_revision')?.setValue(formattedDate, {
    emitEvent: false
  });

  this.form.get('date_revision')?.updateValueAndValidity();
});



  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.notification.warning('Revisa los campos del formulario');
      return;
    }

  const product = this.form.getRawValue();

  const request$ = this.isEditMode
    ? this.productService.update(product)
    : this.productService.create(product);

  request$.subscribe({
    next: (response) => {
      this.notification.success(response.message);
      this.saved.emit();
    },
    error: (err) => {
      const message =
        err?.error?.message || 'No se pudo guardar el producto';
      this.notification.error(message);
    }
  });
}

hasError(controlName: string, error: string): boolean {
  const control = this.form.get(controlName);
  return !!(
    control &&
    control.hasError(error) &&
    (control.touched || control.dirty)
  );
}

resetForm(): void {
  this.form.reset();
}

  onCancel(): void {
    this.cancel.emit();   
  }
}
