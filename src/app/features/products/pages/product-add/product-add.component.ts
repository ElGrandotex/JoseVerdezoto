import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { firstValueFrom, debounceTime, distinctUntilChanged, switchMap, catchError, of, filter } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorHandlerService, DateService } from '../../../../shared';
import { ProductApiItem } from '../../models/product-api.model';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

function minDateToday(dateService: DateService): (control: AbstractControl) => ValidationErrors | null {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return { required: true };
    return !dateService.isDateTodayOrInFuture(value) ? { minDate: true } : null;
  };
}

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductAddComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly productService = inject(ProductService);
  private readonly errorHandler = inject(ErrorHandlerService);
  private readonly dateService = inject(DateService);

  protected readonly isEditMode = signal(false);

  public readonly form = this.fb.group({
    id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)], [this.idAsyncValidator.bind(this)]],
    description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
    releaseDate: ['', [Validators.required, minDateToday(this.dateService)]],
    name: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(100)]],
    logo: ['', [Validators.required]],
    revisionDate: [{ value: '', disabled: true }, []]
  });

  public submitting = false;
  public readonly idStatus = signal<'idle' | 'checking' | 'available' | 'taken' | 'error'>('idle');

  constructor() {
    const releaseDateControl = this.form.get('releaseDate');
    releaseDateControl?.valueChanges.subscribe(releaseDate => {
      const revisionDate = this.dateService.calculateRevisionDate(releaseDate);
      this.form.get('revisionDate')?.setValue(revisionDate, { emitEvent: false });
    });

    const idControl = this.form.get('id');
    idControl?.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged((prev, curr) => prev === curr),
        filter((val): val is string => val !== null),
        switchMap((val: string) => {
          if (!val || val.length < 3) {
            this.idStatus.set('idle');
            const errs = idControl.errors ? { ...idControl.errors } : null;
            if (errs && errs['idTaken']) {
              delete errs['idTaken'];
              const remaining = Object.keys(errs).length ? errs : null;
              idControl.setErrors(remaining);
            }
            return of(null as boolean | null);
          }

          this.idStatus.set('checking');
          return this.productService.verifyId(val).pipe(
            catchError(() => {
              this.idStatus.set('error');
              return of(null as boolean | null);
            })
          );
        })
      )
      .subscribe(result => {
        if (result === null) return;

        if (result === true) {
          const errs = idControl.errors ? { ...idControl.errors } : {};
          errs['idTaken'] = true;
          idControl.setErrors(errs);
          this.idStatus.set('taken');
        } else {
          const errs = idControl.errors ? { ...idControl.errors } : null;
          if (errs && errs['idTaken']) {
            delete errs['idTaken'];
            const remaining = Object.keys(errs).length ? errs : null;
            idControl.setErrors(remaining);
          }
          this.idStatus.set('available');
        }
      });
  }

  public ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId) {
      this.isEditMode.set(false);
      this.form.get('id')?.enable({ emitEvent: false });
      return;
    }

    this.isEditMode.set(true);
    this.form.get('id')?.disable({ emitEvent: false });

    const stateProduct = history.state?.product as Product | undefined;
    const product = stateProduct ?? this.productService.products().find(current => current.id === productId);

    if (!product) {
      this.errorHandler.handleError(new Error('No se encontró el producto para editar.'));
      void this.router.navigate(['']);
      return;
    }

    this.form.patchValue({
      id: product.id,
      name: product.name,
      description: product.description,
      logo: product.logoUrl,
      releaseDate: product.releaseDate,
      revisionDate: product.restructuredDate
    });
  }

  private idAsyncValidator(control: AbstractControl) {
    const val = control.value as string;
    if (!val || val.length < 3) {
      return Promise.resolve(null);
    }

    return firstValueFrom(this.productService.verifyId(val)).then(exists => {
      return exists ? { idTaken: true } : null;
    }).catch(() => {
      return { verificationFailed: true };
    });
  }

  public reset(): void {
    this.form.reset();
  }

  public save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();
    const productId = String(raw.id);
    const apiItem: ProductApiItem = {
      id: productId,
      name: raw.name || '',
      description: raw.description || '',
      logo: raw.logo || '',
      date_release: raw.releaseDate || '',
      date_revision: raw.revisionDate || ''
    };

    this.submitting = true;
    const request$ = this.isEditMode()
      ? this.productService.updateProduct(productId, {
          name: apiItem.name,
          description: apiItem.description,
          logo: apiItem.logo,
          date_release: apiItem.date_release,
          date_revision: apiItem.date_revision
        })
      : this.productService.createProduct(apiItem);

    request$.subscribe(result => {
      this.submitting = false;
      if (result) {
        void this.router.navigate(['']);
      }
    }, err => {
      this.submitting = false;
      this.errorHandler.handleError(err);
    });
  }

  public cancel(): void {
    void this.router.navigate(['']);
  }
}
