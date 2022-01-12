/**
 * Extracts the keys of a type that are not a number.
 */
export type StringKeyof<T> = Exclude<keyof T, number>;

/**
 * Extracts the keys of a type that are not a string.
 */
export type NumberKeyof<T> = Exclude<keyof T, string>;

export type NumericKeyPair<T> = T extends Record<infer K, infer V> ? [K & number, V] : never;

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
	export function sortedPairs<T extends { [P in keyof T & number]: T[P] }>(
		obj: T,
		order: 'asc' | 'desc' = 'desc',
	) {
		const values = [];

		for (const [k, v] of pairs(obj)) {
			values.push([k, v] as NumericKeyPair<T>);
		}

		return values.sort((a, b) => (order === 'desc' ? a[0] > b[0] : a[0] < b[0]));
	}
}
