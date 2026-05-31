export interface ProductApiItem {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly logo: string;
  readonly date_release: string | Date;
  readonly date_revision: string | Date;
}

export interface ProductApiResponse {
  readonly data: readonly ProductApiItem[];
}

export interface ProductApiMutationResponse {
  readonly message: string;
  readonly data: ProductApiItem;
}

export interface ProductApiDeleteResponse {
  readonly message: string;
}

export interface ApiErrorResponse {
  readonly name: string;
  readonly message: string;
}
