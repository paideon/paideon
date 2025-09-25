// packages/transport/src/errors/index.ts

export { ApiError } from './api-error.js';
export type { ApiErrorDetails, ApiErrorParams } from './api-error.js';
export { codeFromStatus } from './error-codes.js';
export type { ApiErrorCode } from './error-codes.js';
export { normalizeError } from './normalize.js';
