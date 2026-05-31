import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ErrorHandlerService } from '../../../shared';
import { ProductApiDeleteResponse, ProductApiMutationResponse, ProductApiResponse } from '../models/product-api.model';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpClient: jest.Mocked<HttpClient>;
  let errorHandler: jest.Mocked<ErrorHandlerService>;

  beforeEach(() => {
    httpClient = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn()
    } as unknown as jest.Mocked<HttpClient>;

    errorHandler = {
      handleError: jest.fn(),
      removeError: jest.fn(),
      clearAll: jest.fn(),
      errors: jest.fn() as unknown as ErrorHandlerService['errors']
    } as unknown as jest.Mocked<ErrorHandlerService>;

    TestBed.configureTestingModule({
      providers: [
        ProductService,
        { provide: HttpClient, useValue: httpClient },
        { provide: ErrorHandlerService, useValue: errorHandler }
      ]
    });

    service = TestBed.inject(ProductService);
  });

  it('should load products and update state', () => {
    const response: ProductApiResponse = {
      data: [
        {
          id: 'UNO',
          name: 'Prueba UNO',
          description: 'Descripcion UNO',
          logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
          date_release: '2026-05-30',
          date_revision: '2027-05-30'
        }
      ]
    };

    httpClient.get.mockReturnValue(of(response));

    service.loadProducts();

    expect(httpClient.get).toHaveBeenCalled();
    expect(service.products()).toHaveLength(1);
    expect(service.loading()).toBe(false);
  });

  it('should create product and prepend it to state', done => {
    const apiResponse: ProductApiMutationResponse = {
      message: 'created',
      data: {
        id: 'NUEVE',
        name: 'Prueba NUEVE',
        description: 'Descripcion NUEVE',
        logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
        date_release: '2026-05-30',
        date_revision: '2027-05-30'
      }
    };

    httpClient.post.mockReturnValue(of(apiResponse));

    service.createProduct({
      id: 'NUEVE',
      name: 'Prueba NUEVE',
      description: 'Descripcion NUEVE',
      logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
      date_release: '2026-05-30',
      date_revision: '2027-05-30'
    }).subscribe(product => {
      expect(product.id).toBe('NUEVE');
      expect(service.products()[0].id).toBe('NUEVE');
      done();
    });
  });

  it('should update product in state', done => {
    const existingResponse: ProductApiResponse = {
      data: [
        {
          id: 'DIEZ',
          name: 'Prueba DIEZ',
          description: 'Descripcion DIEZ',
          logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
          date_release: '2026-05-30',
          date_revision: '2027-05-30'
        }
      ]
    };

    httpClient.get.mockReturnValue(of(existingResponse));
    service.loadProducts();

    const apiResponse: ProductApiMutationResponse = {
      message: 'updated',
      data: {
        id: 'DIEZ',
        name: 'Nuevo nombre',
        description: 'Descripcion nueva',
        logo: 'nuevologo.jpg',
        date_release: '2026-06-01',
        date_revision: '2027-06-01'
      }
    };

    httpClient.put.mockReturnValue(of(apiResponse));

    service.updateProduct('DIEZ', {
      name: 'Nuevo nombre',
      description: 'Descripcion nueva',
      logo: 'nuevologo.jpg',
      date_release: '2026-06-01',
      date_revision: '2027-06-01'
    }).subscribe(product => {
      expect(product.name).toBe('Nuevo nombre');
      expect(service.products()[0].name).toBe('Nuevo nombre');
      done();
    });
  });

  it('should delete product from state', done => {
    const existingResponse: ProductApiResponse = {
      data: [
        {
          id: 'UNO',
          name: 'Prueba UNO',
          description: 'Descripcion UNO',
          logo: 'https://www.visa.com.ec/dam/VCOM/regional/lac/SPA/Default/Pay%20With%20Visa/Tarjetas/visa-signature-400x225.jpg',
          date_release: '2026-05-30',
          date_revision: '2027-05-30'
        }
      ]
    };

    httpClient.get.mockReturnValue(of(existingResponse));
    service.loadProducts();

    const deleteResponse: ProductApiDeleteResponse = { message: 'deleted' };
    httpClient.delete.mockReturnValue(of(deleteResponse));

    service.deleteProduct('UNO').subscribe(result => {
      expect(result).toBe(true);
      expect(service.products()).toHaveLength(0);
      done();
    });
  });

  it('should return false when verifyId fails', done => {
    httpClient.get.mockReturnValue(throwError(() => new Error('network error')));

    service.verifyId('UNO').subscribe(result => {
      expect(result).toBe(false);
      done();
    });
  });
});
