import { Injectable } from '@nestjs/common';
import {
  CapabilityGrantSchema,
  type CapabilityGrantData,
} from '@paideon/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CapabilityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Everything the person may do, read fresh from the database so that a
   * change of access takes effect on the next request, not at next sign-in.
   * Rows that do not match the contract (an old or mistyped capability name)
   * are ignored: unknown names grant nothing.
   */
  async grantsFor(userId: string): Promise<CapabilityGrantData[]> {
    const rows = await this.prisma.capabilityGrant.findMany({
      where: { userId },
      select: { capability: true, scope: true },
    });
    const grants: CapabilityGrantData[] = [];
    for (const row of rows) {
      const parsed = CapabilityGrantSchema.safeParse(row);
      if (parsed.success) grants.push(parsed.data);
    }
    return grants;
  }
}
