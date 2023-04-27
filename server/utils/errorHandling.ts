import { FastifyReply, FastifyRequest } from 'fastify';
import status from 'http-status'
import logger from './logger';
import httpStatus from 'http-status';

/**
 * Error class used to render an error response
 */
export abstract class ApiError extends Error {
  private error: Error|undefined;
  private msg: string|undefined;

  constructor(message?: string, e?: Error) {
    super(message);
    this.msg = message;
    this.error = e;
  }

  abstract getCode(): number;

  getStatusMessage(): string {
    return status[this.getCode()] ?? '';
  }

  get message(): string {
    return this.msg || this.error?.message || '';
  }

  get stack(): string|undefined {
    return this.error?.stack;
  }

  getOriginalError(): Error | undefined {
    return this.error;
  }
}

/**
 * Not Found
 */
export class NotFoundException extends ApiError {
  constructor(msg?: string) {
    super(msg);
  }
  getCode(): number {
    return status.NOT_FOUND;
  }
}

/**
 * Bad Request
 */
export class BadRequestException extends ApiError {
  constructor(msg?: string) {
    super(msg);
  }
  getCode(): number {
    return status.BAD_REQUEST;
  }
}

// Add more exceptions as needed

// global error handler
export const errorHandler = (err: Error, _req: FastifyRequest, res: FastifyReply): void => {
  if (err instanceof ApiError) {
    res.status(err.getCode());
    res.send({status: err.getCode(), message: err.message});
  } else {
    // log error
    logger.error(err.stack || err.message);
    // send generic error for any unhandled exceptions
    res.status(500);
    res.send({status: httpStatus.INTERNAL_SERVER_ERROR, message: 'An internal error occurred.'});
  }
};
