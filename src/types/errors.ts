export class ExcelParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExcelParseError';
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}