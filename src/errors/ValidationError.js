'use strict';

const UwaveError = require('./UwaveError');

class ValidationError extends UwaveError {
  /**
   * @param {any} errors
   * @param {import('ajv').default} ajv
   */
  constructor(errors, ajv) {
    const message = ajv ? ajv.errorsText(errors) : 'Validation failed';
    super(message);

    this.expose = true;
    this.name = 'ValidationError';
    this.code = 'SCHEMA_VALIDATION_FAILED';

    this.errors = errors;
  }
}

module.exports = ValidationError;
