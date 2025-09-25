// packages/contracts/src/primitives/media/document.ts

import { z } from 'zod';

export const DocumentSchema = z.object({
  src: z.string(), // R2 key or URL
  title: z.string(),
  fileType: z.enum(['PDF', 'DOCX', 'XLSX', 'PPT', 'ZIP']),
  fileSize: z.string().optional(), // human-readable: '2.4 MB'
  description: z.string().optional(),
});

export type DocumentData = z.infer<typeof DocumentSchema>;
