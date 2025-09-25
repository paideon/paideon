// packages/contracts/src/system/cms/workflow-state.ts
//
// The draft/review/publish workflow state enum and the set of legal transitions between states.

import { z } from 'zod';

import { PublishStatusEnum } from '../../primitives/enums/publish-status.ts';

export const WorkflowTransitionSchema = z.object({
  from: PublishStatusEnum,
  to: PublishStatusEnum,
  triggeredBy: z.string(),
});

export type WorkflowTransitionData = z.infer<typeof WorkflowTransitionSchema>;
