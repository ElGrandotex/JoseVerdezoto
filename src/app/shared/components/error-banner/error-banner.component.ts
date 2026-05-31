import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { AppError } from '../../models/error.model';

@Component({
  selector: 'app-error-banner',
  standalone: true,
  templateUrl: './error-banner.component.html',
  styleUrl: './error-banner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorBannerComponent {
  @Input() errors: readonly AppError[] = [];

  @Output() dismissed = new EventEmitter<AppError>();

  public dismiss(error: AppError): void {
    this.dismissed.emit(error);
  }

  public getErrorMessage(error: AppError): string {
    return error.message || 'Ocurrió un error desconocido';
  }
}
