import { ChangeDetectionStrategy, Component, OnInit, Signal, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ErrorHandlerService } from '../../../../shared';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent {
  protected readonly searchTerm = signal('');
  protected readonly currentPage = signal(1);
  protected readonly pageSize = signal(5);
  protected readonly pageSizeOptions = [5, 10, 20] as const;
  protected readonly openMenuProductId = signal<string | null>(null);
  protected readonly productPendingDelete = signal<Product | null>(null);
  protected readonly products: Signal<readonly Product[]>;
  protected readonly loading: Signal<boolean>;

  protected readonly filteredProducts = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const list = this.products();

    if (!term) {
      return list;
    }

    return list.filter(product =>
      [product.name, product.description, product.releaseDate, product.restructuredDate]
        .join(' ')
        .toLowerCase()
        .includes(term)
    );
  });

  protected readonly totalPages = computed(() => {
    const total = this.filteredProducts().length;
    return Math.ceil(total / this.pageSize());
  });

  protected readonly pagedProducts = computed(() => {
    const startIndex = (this.currentPage() - 1) * this.pageSize();
    return this.filteredProducts().slice(startIndex, startIndex + this.pageSize());
  });

  protected readonly displayedResults = computed(() => this.pagedProducts().length);

  constructor(
    private readonly productService: ProductService,
    private readonly errorHandler: ErrorHandlerService,
    private readonly router: Router
  ) {
    this.products = this.productService.products;
    this.loading = this.productService.loading;
  }

  public ngOnInit(): void {
    this.productService.loadProducts();
  }

  protected onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  protected onPageSizeChange(value: string | number): void {
    this.pageSize.set(Number(value));
    this.currentPage.set(1);
    this.openMenuProductId.set(null);
  }

  protected toggleMenu(productId: string): void {
    this.openMenuProductId.update(current => (current === productId ? null : productId));
  }

  protected onRowClick(product: Product): void {
    this.openMenuProductId.update(current => (current === product.id ? null : product.id));
  }

  protected editProduct(product: Product): void {
    this.openMenuProductId.set(null);
    void this.router.navigate(['/products', 'edit', product.id], {
      state: { product }
    });
  }

  protected deleteProduct(product: Product): void {
    this.openMenuProductId.set(null);
    this.productPendingDelete.set(product);
  }

  protected cancelDelete(): void {
    this.productPendingDelete.set(null);
  }

  protected confirmDelete(): void {
    const product = this.productPendingDelete();
    if (!product) {
      return;
    }

    this.productService.deleteProduct(product.id).subscribe(success => {
      if (!success) {
        return;
      }

      this.productPendingDelete.set(null);

      if (this.pagedProducts().length === 0 && this.currentPage() > 1) {
        this.currentPage.update(page => Math.max(1, page - 1));
      }
    });
  }

  protected addProduct(): void {
    try {
      void this.router.navigate(['/products', 'add']);
    } catch (error) {
      this.errorHandler.handleError(error);
    }
  }
}
