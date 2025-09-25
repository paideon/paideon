// packages/contracts/src/system/storage/upload.ts
//
// The upload request and upload result shapes.

import { z } from 'zod';

import { DEFAULT_UPLOAD_LIMIT } from '../../constants/limits.ts';

export const UPLOAD_FOLDER_VALUES = [
  'images',
  'documents',
  'media',
  'avatars',
] as const;

export const UploadFolderEnum = z.enum(UPLOAD_FOLDER_VALUES);

export type UploadFolderEnumData = z.infer<typeof UploadFolderEnum>;

export const UploadRequestSchema = z.object({
  fileName: z.string(),
  fileType: z.string(),
  fileSize: z.number().max(DEFAULT_UPLOAD_LIMIT),
  folder: UploadFolderEnum,
});

export type UploadRequestData = z.infer<typeof UploadRequestSchema>;

export const UploadResultSchema = z.object({
  key: z.string(), // R2 object key
  url: z.string(), // CDN URL
  uploadedAt: z.string(),
});

export type UploadResultData = z.infer<typeof UploadResultSchema>;
