/**
 * Recursively strips `undefined` object properties (and filters `undefined` inside arrays
 * or preserves clean array items) so Firestore `setDoc` / `writeBatch.set` never fails with
 * `Function setDoc() called with invalid data. Unsupported field value: undefined`.
 */
export function stripUndefinedDeep<T>(input: T): T {
  if (Array.isArray(input)) {
    return input
      .filter((item) => item !== undefined)
      .map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (input && typeof input === 'object' && !(input instanceof Date)) {
    const cleaned: Record<string, unknown> = {};
    Object.entries(input as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== undefined) {
        cleaned[key] = stripUndefinedDeep(value);
      }
    });
    return cleaned as T;
  }
  return input;
}
