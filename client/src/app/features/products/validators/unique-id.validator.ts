import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { debounceTime, map, switchMap, of, catchError  } from 'rxjs';
import { ProductService } from '../services/product.service';

export function uniqueProductIdValidator(
  productService: ProductService
): AsyncValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) return of(null);

    return of(control.value).pipe(
      debounceTime(400),
      switchMap(id =>
        productService.checkIdExists(id).pipe(
          map(exists => (exists ? { idExists: true } : null)),
          
        )
      )
    );
  };
}
