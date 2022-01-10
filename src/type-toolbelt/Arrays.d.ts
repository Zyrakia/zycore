/**
 * Recursively unpacks an array until the type is no longer an array.
 */
export type UnpackedArray<T> = T extends Array<infer U> ? UnpackedArray<U> : T;

/**
 * Declares an array type that can be infinitely nested.
 */
export type NestedArray<T> = Array<NestedArray<T> | T>;
