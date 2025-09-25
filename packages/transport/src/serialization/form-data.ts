// packages/transport/src/serialization/form-data.ts

/** Converts a params object into FormData; Blob/File values are appended as-is, everything else is stringified. */
export function toFormData(params: Record<string, unknown>): FormData {
  const formData = new FormData();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;

    if (value instanceof Blob || typeof value === 'string') {
      formData.append(key, value);
      continue;
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        formData.append(key, item instanceof Blob ? item : String(item));
      }
      continue;
    }

    formData.append(key, String(value));
  }

  return formData;
}
