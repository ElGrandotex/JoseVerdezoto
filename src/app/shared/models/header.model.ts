export interface HeaderConfig {
  readonly title: string;
  readonly showMoneyIcon: boolean;
  readonly ariaLabel: string;
}

export const DEFAULT_HEADER_CONFIG: HeaderConfig = {
  title: 'BANCO',
  showMoneyIcon: true,
  ariaLabel: 'Encabezado principal de la aplicación bancaria'
};
