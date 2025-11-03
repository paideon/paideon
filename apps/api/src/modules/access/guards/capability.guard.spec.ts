import 'reflect-metadata';
import { ForbiddenException, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Requires } from '../decorators/requires.decorator';
import { CapabilityGuard } from './capability.guard';

class Routes {
  @Requires('library.desk')
  desk() {
    return 'desk';
  }

  @Requires('library.reports', 'library.desk')
  either() {
    return 'either';
  }

  unlabelled() {
    return 'open?';
  }
}

const contextFor = (handler: () => string, user?: object) =>
  ({
    getHandler: () => handler,
    getClass: () => Routes,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  }) as unknown as ExecutionContext;

const person = { sub: 'u1', schoolId: 's1', role: 'STUDENT' };

function guardFor(held: { capability: string; scope: string }[]) {
  const access = { capabilitiesFor: jest.fn().mockResolvedValue(held) };
  return new CapabilityGuard(new Reflector(), access as never);
}

describe('CapabilityGuard', () => {
  const routes = new Routes();

  it('lets in a person who holds the capability', async () => {
    const guard = guardFor([{ capability: 'library.desk', scope: 'SCHOOL' }]);
    await expect(
      guard.canActivate(contextFor(routes.desk, person)),
    ).resolves.toBe(true);
  });

  it('refuses a person who does not', async () => {
    const guard = guardFor([
      { capability: 'library.catalog.read', scope: 'SCHOOL' },
    ]);
    await expect(
      guard.canActivate(contextFor(routes.desk, person)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('accepts any one of several capabilities', async () => {
    const guard = guardFor([{ capability: 'library.desk', scope: 'SCHOOL' }]);
    await expect(
      guard.canActivate(contextFor(routes.either, person)),
    ).resolves.toBe(true);
  });

  it('fails closed on a route nobody labelled', async () => {
    const guard = guardFor([{ capability: 'library.desk', scope: 'SCHOOL' }]);
    await expect(
      guard.canActivate(contextFor(routes.unlabelled, person)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('refuses a request with no signed-in person', async () => {
    const guard = guardFor([{ capability: 'library.desk', scope: 'SCHOOL' }]);
    await expect(
      guard.canActivate(contextFor(routes.desk)),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });
});
