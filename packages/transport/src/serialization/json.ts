// packages/transport/src/serialization/json.ts

export function toJson(value: unknown): string {
  return JSON.stringify(value);
}

export function fromJson<T = unknown>(text: string): T {
  return JSON.parse(text) as T;
}
