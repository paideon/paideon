// zod-validation.pipe.ts
//
// Validates a request body with a Zod schema from @paideon/contracts.
// The auth endpoints use this instead of class-validator DTO classes,
// so the API and the portal run the exact same rules.
//
// Usage in a controller:
//   @Post('login')
//   login(@ZodBody(LoginRequestSchema) dto: LoginRequestData) { ... }
//
// What happens on each request:
//   1. The raw JSON body is checked against the schema.
//   2. If something is wrong → HTTP 400 with a list of messages
//      (same response shape the global ValidationPipe produces:
//       { statusCode: 400, message: string[], error: 'Bad Request' }),
//      and the handler never runs.
//   3. If it is fine → the handler receives the CLEANED data
//      (trimmed, lowercased, ...), not the raw body.

import {
  BadRequestException,
  Body,
  PipeTransform,
  Query,
} from '@nestjs/common';
import type { ZodType, ZodTypeDef } from 'zod';

export class ZodValidationPipe<TOutput> implements PipeTransform<
  unknown,
  TOutput
> {
  constructor(private readonly schema: ZodType<TOutput, ZodTypeDef, unknown>) {}

  transform(value: unknown): TOutput {
    // Express 5 leaves req.body undefined when the request has no body.
    // `?? {}` lets the schema report friendly "Enter your ..." messages
    // instead of a bare "Required".
    const result = this.schema.safeParse(value ?? {});

    if (!result.success) {
      // `fieldErrors` names the first problem of each field, so a form can
      // show it under the right input (see ApiErrorSchema in contracts).
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.length > 0 ? String(issue.path[0]) : '_form';
        fieldErrors[key] ??= issue.message;
      }
      throw new BadRequestException({
        statusCode: 400,
        error: 'Bad Request',
        message: result.error.issues.map((issue) => issue.message),
        fieldErrors,
      });
    }

    return result.data;
  }
}

// Shortcut for @Body(new ZodValidationPipe(schema)).
export const ZodBody = <TOutput>(
  schema: ZodType<TOutput, ZodTypeDef, unknown>,
) => Body(new ZodValidationPipe(schema));

// The same for the query string: @ZodQuery(StudentListQuerySchema) query.
export const ZodQuery = <TOutput>(
  schema: ZodType<TOutput, ZodTypeDef, unknown>,
) => Query(new ZodValidationPipe(schema));
