import { ProductApiItem } from '../models/product-api.model';
import { Product } from '../models/product.model';

export class ProductMapper {
  public static toProduct(item: ProductApiItem): Product {
    return {
      id: String(item.id),
      logoUrl: item.logo,
      name: item.name,
      description: item.description,
      releaseDate: this.normalizeDate(item.date_release),
      restructuredDate: this.normalizeDate(item.date_revision)
    };
  }

  public static toProducts(items: readonly ProductApiItem[]): Product[] {
    return items.map(item => this.toProduct(item));
  }

  private static normalizeDate(value: string | Date): string {
    if (!value) {
      return '';
    }

    const date = value instanceof Date ? value : new Date(value);

    if (Number.isNaN(date.getTime())) {
      return '';
    }

    return date.toISOString().slice(0, 10);
  }
}
