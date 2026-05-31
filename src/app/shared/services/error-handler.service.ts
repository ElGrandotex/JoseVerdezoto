import { Injectable, signal } from '@angular/core';
import { ApplicationError, AppError } from '../models/error.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  private readonly errorState = signal<AppError[]>([]);
  public readonly errors = this.errorState.asReadonly();

  private readonly MAX_ERRORS = 5;
  private readonly ERROR_DISPLAY_TIME = 5000;

  public handleError(error: unknown): AppError {
    const appError = this.normalizeError(error);
    this.addError(appError);
    this.logError(appError);
    return appError;
  }

  private normalizeError(error: unknown): AppError {
    if (error instanceof ApplicationError) {
      return error.toJSON();
    }

    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        details: error.stack,
        timestamp: new Date()
      };
    }

    return {
      code: 'UNKNOWN_ERROR',
      message: 'Ocurrió un error desconocido',
      details: error,
      timestamp: new Date()
    };
  }

  private addError(error: AppError): void {
    const currentErrors = this.errorState();
    const updatedErrors = [...currentErrors, error];
    if (updatedErrors.length > this.MAX_ERRORS) {
      updatedErrors.shift();
    }

    this.errorState.set(updatedErrors);
    setTimeout(() => {
      this.removeError(error);
    }, this.ERROR_DISPLAY_TIME);
  }

  public removeError(error: AppError): void {
    this.errorState.update(errors =>
      errors.filter(
        e => e.timestamp !== error.timestamp || e.message !== error.message
      )
    );
  }

  public clearAll(): void {
    this.errorState.set([]);
  }

  private logError(error: AppError): void {
    if (!this.isProduction()) {
      console.error(`[${error.code}] ${error.message}`, error.details);
    }
  }

  private isProduction(): boolean {
    return this.getEnvironment() === 'production';
  }

  private getEnvironment(): string {
    return typeof process !== 'undefined' && process.env?.['NODE_ENV'] ? process.env['NODE_ENV'] : 'development';
  }
}
