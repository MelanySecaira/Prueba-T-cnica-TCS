import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, combineLatest, map, Observable, switchMap  } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { FormControl, ReactiveFormsModule  } from '@angular/forms';
import { ProductFormComponent } from '../product-form/product-form.component';
import { startWith } from 'rxjs/operators';
import { NotificationService } from '../../../../core/services/notification.service'


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ProductFormComponent      ],
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {

  private refresh$ = new BehaviorSubject<void>(undefined);

  limit$ = new BehaviorSubject<number>(5);
  private readonly loadingSubject = new BehaviorSubject<boolean>(true);

  loading$ = this.loadingSubject.asObservable();

  searchControl = new FormControl<string>('', { nonNullable: true });

  selectedProduct?: Product;
  showModal = false;
  isEditMode = false;
  openMenuId: string | null = null;
  modalMode: 'form' | 'delete' | null = null;

  products$ = combineLatest([
    this.refresh$.pipe(
      switchMap(() => {
        this.loadingSubject.next(true);
        return this.productService.getAll();
      }),
      map(res => res.data),
      map(products => {
        this.loadingSubject.next(false);
        return products;
      })
    ),
    this.searchControl.valueChanges.pipe(startWith('')),
    this.limit$
  ]).pipe(
    map(([products, term, limit]) =>
      products
        .filter(p =>
          p.name.toLowerCase().includes(term.toLowerCase()) ||
          p.description.toLowerCase().includes(term.toLowerCase())
        )
        .slice(0, limit)
    )
  );

  constructor(
    private productService: ProductService,
    private notification: NotificationService
  ) {}

  refresh(): void {
    this.refresh$.next();
  }

  openCreateModal(): void {
    this.selectedProduct = undefined;
    this.isEditMode = false;
    this.modalMode = 'form';
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.selectedProduct = product;
    this.isEditMode = true;
    this.modalMode = 'form';
    this.showModal = true;
  }

  openDeleteModal(product: Product): void {
    this.selectedProduct = product;
    this.modalMode = 'delete';
    this.showModal = true;
    this.closeMenu();
  }

  closeModal(): void {
    this.showModal = false;
    this.modalMode = null;
    this.selectedProduct = undefined;
  }

  onSaved(): void {
    this.closeModal();
    this.refresh();
  }

  toggleMenu(id: string): void {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  closeMenu(): void {
    this.openMenuId = null;
  }

  confirmDelete(): void {
    if (!this.selectedProduct) return;

    this.productService.delete(this.selectedProduct.id).subscribe({
      next: res => {
        this.notification.success(res.message);
        this.refresh();
        this.closeModal();
      }
    });
  }

}