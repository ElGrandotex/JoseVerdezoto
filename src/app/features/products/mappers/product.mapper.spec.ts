import { ProductMapper } from './product.mapper';
import { ProductApiItem } from '../models/product-api.model';

describe('ProductMapper', () => {
  it('should map api item to product', () => {
    const apiItem: ProductApiItem = {
      id: 111,
      name: 'Producto UNO',
      description: 'Descripcion UNO',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2026-05-30',
      date_revision: '2027-05-30'
    } as unknown as ProductApiItem;

    const result = ProductMapper.toProduct(apiItem);

    expect(result).toEqual({
      id: '111',
      logoUrl: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      name: 'Producto UNO',
      description: 'Descripcion UNO',
      releaseDate: '2026-05-30',
      restructuredDate: '2027-05-30'
    });
  });

  it('should return empty date strings for invalid dates', () => {
    const apiItem: ProductApiItem = {
      id: 'DOS',
      name: 'Producto DOS',
      description: 'Descripcion DOS',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: 'invalid-date',
      date_revision: ''
    };

    const result = ProductMapper.toProduct(apiItem);

    expect(result.releaseDate).toBe('');
    expect(result.restructuredDate).toBe('');
  });

  it('should map a list of api items', () => {
    const items: ProductApiItem[] = [
      {
        id: 'UNO',
        name: 'Prueba UNO',
        description: 'Descripcion UNO',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2026-01-01',
        date_revision: '2027-01-01'
      },
      {
        id: 'DOS',
        name: 'Prueba DOS',
        description: 'Descripcion DOS',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2026-02-02',
        date_revision: '2027-02-02'
      }
    ];

    const result = ProductMapper.toProducts(items);

    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('UNO');
    expect(result[1].id).toBe('DOS');
  });
});
