import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DEFAULT_HEADER_CONFIG, HeaderConfig } from '../../models/header.model';

@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @Input() config: HeaderConfig = DEFAULT_HEADER_CONFIG;
}
