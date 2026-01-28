import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minTodayDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value) return null;

  // Fecha ingresada (viene como string yyyy-MM-dd)
  const inputDate = new Date(control.value + 'T00:00:00');

  // Fecha de hoy SIN hora
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate < today ? { minTodayDate: true } : null;
}


export function revisionOneYearAfter(
  releaseControlName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const releaseValue = parent.get(releaseControlName)?.value;
    if (!releaseValue || !control.value) return null;

    const releaseDate = new Date(releaseValue);
    const expected = new Date(releaseDate);
    expected.setFullYear(expected.getFullYear() + 1);

    const revisionDate = new Date(control.value);

    return revisionDate.toDateString() === expected.toDateString()
      ? null
      : { notOneYearAfter: true };
  };
}
