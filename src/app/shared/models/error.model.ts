export interface AppError {
  code: string;
  message: string;
  details?: unknown;
  timestamp: Date;
}

export class ApplicationError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.timestamp = new Date();
  }

  public timestamp: Date;

  public toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}
