import { Strings } from 'Strings';

/** Extracts the keys of a type that are not a number. */
export type StringKeyof<T> = Exclude<keyof T, number | symbol>;

/** Extracts the keys of a type that are not a string. */
export type NumberKeyof<T> = Exclude<keyof T, string>;

/** Representation of a numeric key-pair entry. */
export type NumericKeyPair<T> = T extends Record<infer K, infer V> ? [K & number, V] : never;

/** Recursively returns all string keys in the given object in their capitalized form. */
export type CapitalizeKeys<T> = {
	[K in StringKeyof<T> as Capitalize<K>]: T[K] extends object ? CapitalizeKeys<T[K]> : T[K];
};

/** Recursively returns all string keys in the given object in their uncapitalized form. */
export type UncapitalizeKeys<T> = {
	[K in StringKeyof<T> as Uncapitalize<K>]: T[K] extends object ? UncapitalizeKeys<T[K]> : T[K];
};

export namespace Objects {
	/**
	 * Converts an object into an array of key-value pairs and then
	 * sorts them by key in the specified order (default descending).
	 *
	 * Credits to Voralias (https://github.com/Vorlias) since I
	 * basically just copy-pasted the Typescript typings.
	 *
	 * @param obj The object to convert
	 * @order The order to sort the keys in
	 * @returns The sorted array of key-value pairs
	 */
	export function sortedPairs<T extends { [P in keyof T & number]: T[P] }>(obj: T, order: 'asc' | 'desc' = 'desc') {
		const values = [];

		for (const [k, v] of pairs(obj)) {
			values.push([k, v] as NumericKeyPair<T>);
		}

		return values.sort((a, b) => (order === 'desc' ? a[0] > b[0] : a[0] < b[0]));
	}

	/**
	 * Converts the given object into a copy with all the string keys
	 * converted into their capitalized form, this does NOT modify
	 * the original object, it constructs a new object.
	 *
	 * @param obj The object to convert
	 * @returns The converted object
	 */
	export function capitalizeKeys<T extends {}>(obj: T): CapitalizeKeys<T> {
		const copy = {} as { [key: string | number | symbol]: unknown };

		for (const entry of pairs(obj)) {
			const [key, value] = entry as [keyof T, any];
			const newKey = typeIs(key, 'string') ? Strings.capitalize(key) : key;

			if (typeIs(value, 'table')) copy[newKey] = capitalizeKeys(value);
			else copy[newKey] = value;
		}

		return copy as CapitalizeKeys<T>;
	}

	/**
	 * Converts the given object into a copy with all the string keys
	 * converted into their uncapitalized form, this does NOT modify
	 * the original object, it constructs a new object.
	 *
	 * @param obj The object to convert
	 * @returns The converted object
	 */
	export function uncapitalizeKeys<T extends {}>(obj: T): UncapitalizeKeys<T> {
		const copy = {} as { [key: string | number | symbol]: unknown };

		for (const entry of pairs(obj)) {
			const [key, value] = entry as [keyof T, any];
			const newKey = typeIs(key, 'string') ? Strings.uncapitalize(key) : key;

			if (typeIs(value, 'table')) copy[newKey] = uncapitalizeKeys(value);
			else copy[newKey] = value;
		}

		return copy as UncapitalizeKeys<T>;
	}

	/**
	 * Iterates through all keys in object one and checks whether the key exists in object two,
	 * if it does not exist, the key is added to the return list. If the key does exist, it will check
	 * if the values are referentially equal, if they are not, the key is added to the return list.
	 *
	 * This only detects keys that were removed or changed, not keys that were added.
	 *
	 * @param objectOne The first object to compare
	 * @param objectTwo The second object to compare
	 * @returns The list of keys in object one that have changed
	 */
	export function getChangedKeys<T extends {}, U extends {}>(objectOne: T, objectTwo: U) {
		const diff = [];

		for (const [key, value] of pairs(objectOne)) {
			if (!((key as keyof T) in objectTwo)) diff.push(key);
			else if (value !== objectTwo[key as unknown as keyof U]) diff.push(key);
		}

		return diff as (keyof T)[];
	}
}
