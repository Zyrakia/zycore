/**
 * Converts an array of checkable type names to a tuple of the corresponding
 * checkable type.
 */
type CheckableTypeNamesToTypeTuple<T extends Array<keyof CheckableTypes>> = {
	[key in keyof T]: T[key] extends keyof CheckableTypes ? CheckableTypes[T[key]] : never;
};

/**
 * Checks if every provided type name matches the type
 * of the corresponding value in the follow-up function
 * call.
 *
 * Example:
 * ```ts
 * const a = '';
 * const b = 5;
 * const c = true;
 * const d = undefined;
 *
 * typesAre('string', 'number', 'boolean', 'nil')(a, b, c, undefined) // true;
 * ```
 * 
 * This can be used to verify the types of multiple variables at once if
 * they are for example sent over the network.
 */
export function typesAre<T extends Array<keyof CheckableTypes>>(...types: T) {
	return function (...values: CheckableTypeNamesToTypeTuple<T>) {
		for (let i = 0; i < types.size(); i++) {
			const typeName = types[i];
			const value = values[i];
			if (!typeIs(value, typeName)) return false;
		}

		return true;
	};
}
