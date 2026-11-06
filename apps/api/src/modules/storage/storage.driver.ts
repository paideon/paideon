// Where uploaded files live. The app talks to this interface only, so the
// local-disk driver used today can be swapped for object storage (S3, R2)
// by adding another class and changing STORAGE_DRIVER, with no change to the
// code that saves or serves photos.

export const STORAGE_DRIVER = Symbol('STORAGE_DRIVER');

export interface StorageDriver {
  /** Name saved in Media.bucket so a row says where its file is. */
  readonly name: string;
  put(key: string, data: Buffer): Promise<void>;
  /** The file's bytes, or null when there is no file under that key. */
  get(key: string): Promise<Buffer | null>;
  delete(key: string): Promise<void>;
}
