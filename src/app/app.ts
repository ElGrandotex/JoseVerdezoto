import { Component } from '@angular/core';
import { Signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  AppError,
  DEFAULT_HEADER_CONFIG,
  ErrorBannerComponent,
  ErrorHandlerService,
  HeaderComponent,
  HeaderConfig
} from './shared';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, ErrorBannerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected headerConfig: HeaderConfig = DEFAULT_HEADER_CONFIG;

  protected readonly errors: Signal<AppError[]>;

  constructor(protected readonly errorHandler: ErrorHandlerService) {
    this.errors = this.errorHandler.errors;
  }

  protected dismissError(error: AppError): void {
    this.errorHandler.removeError(error);
  }
}
