// Base error export class for MongoDB operations
export class MongoError extends Error {
  public originalError?: any;

  constructor(message?: string, originalError?: object) {
    super(message);
    this.name = 'MongoError';
    this.originalError = originalError;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// Error export class for MongoDB create operation failures
export class MongoCreateError extends MongoError {
  constructor(message?: string, originalError?: object) {
    super(message, originalError);
    this.name = 'MongoCreateError';
  }
}

// Error export class for MongoDB read operation failures
export class MongoReadError extends MongoError {
  constructor(message?: string, originalError?: object) {
    super(message, originalError);
    this.name = 'MongoReadError';
  }
}

// Error export class for MongoDB update operation failures
export class MongoUpdateError extends MongoError {
  constructor(message?: string, originalError?: object) {
    super(message, originalError);
    this.name = 'MongoUpdateError';
  }
}

// Error export class for MongoDB delete operation failures
export class MongoDeleteError extends MongoError {
  constructor(message?: string, originalError?: object) {
    super(message, originalError);
    this.name = 'MongoDeleteError';
  }
}

// Error export class for entity conversion failures
export class EntityConversionError extends Error {
  public data?: any;

  constructor(message?: string, data?: object) {
    super(message);
    this.name = 'EntityConversionError';
    this.data = data;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
