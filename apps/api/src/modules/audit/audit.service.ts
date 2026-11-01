import { Injectable, Logger } from '@nestjs/common';
import type { Prisma } from '@paideon/database/generated/client/client';
import { PrismaService } from '../prisma/prisma.service';

export type AuditEntry = {
  schoolId: string;
  actorUserId: string;
  actorRole: string;
  actorPaideonId: string;
  /** Dotted verb, e.g. 'me.contact.update'. */
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: Prisma.InputJsonValue;
  newValues?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
};

// Who did what to which record. Never put passwords, tokens or hashes in
// oldValues / newValues: only the fields a person would read in a history list.
@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly prisma: PrismaService) {}

  /** Throws if the entry cannot be saved, so a change is never made without its record. */
  async record(
    entry: AuditEntry,
    db: Pick<PrismaService, 'auditLog'> = this.prisma,
  ) {
    await db.auditLog.create({ data: entry });
  }

  /** For after-the-fact entries where failing to log must not undo the action. */
  async recordQuietly(entry: AuditEntry) {
    try {
      await this.record(entry);
    } catch (error) {
      this.logger.error(`Could not write audit entry ${entry.action}`, error);
    }
  }
}
