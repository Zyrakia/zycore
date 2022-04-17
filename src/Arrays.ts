/**
 * Recursively unpacks an array until the type is no longer an array.
 */
export type UnpackedArray<T> = T extends Array<infer U> ? UnpackedArray<U> : T;

/**
 * Declares an array type that can be infinitely nested.
 */
export type NestedArray<T> = Array<NestedArray<T> | T>;

export namespace Arrays {
	/**
	 * Returns a random element of the input array.
	 *
	 * @param array The array to choose a random element from.
	 * @param random An optional random source.
	 * @returns A random element of the input array.
	 */
	export function pickRandom<T extends defined[]>(array: T, random = new Random()): T[number] {
		return array[random.NextInteger(0, array.size() - 1)];
	}

	/**
	 * Returns a random element of the input array based upon
	 * the weight of each element.
	 *
	 * A random weight is generated at the start between 0 and the total weight
	 * of the array, and then each element is checked to see if it's weight
	 * added to the running total is greater than the random weight. If so,
	 * the element is returned. As a fallback, the last element is returned.
	 *
	 * @param array The array to choose a random element from.
	 * @param random An optional random source.
	 * @returns A random element of the input array.
	 */
	export function pickWeightedRandom<T extends { weight: number }[]>(
		array: T,
		random = new Random(),
	): T[number] {
		const totalWeight = array.reduce((sum, item) => sum + item.weight, 0);
		const randomWeight = random.NextNumber(0, totalWeight);
		let currentWeight = 0;

		for (const item of array) {
			currentWeight += item.weight;
			if (currentWeight > randomWeight) return item;
		}

		return array[array.size() - 1];
	}

	/**
	 * Checks if both arrays are the same size and contain the same elements.
	 *
	 * @param first The first array to compare.
	 * @param second The second array to compare.
	 * @returns A boolean indicating whether the arrays are equal.
	 */
	export function equals<T extends defined>(first: T[], second: T[]) {
		if (first.size() !== second.size()) return false;

		for (let i = 0; i < first.size(); i++) {
			if (first[i] !== second[i]) return false;
		}

		return true;
	}

	/**
	 * Checks if both arrays are the same size, and all elements of the first
	 * array are somewhere in the second array.
	 *
	 * @param first The first array to compare.
	 * @param second The second array to compare.
	 * @returns A boolean indicating whether the second array contains all elements of the first array.
	 */
	export function fuzzyEquals<T extends defined>(first: T[], second: T[]) {
		if (first.size() !== second.size()) return false;

		for (const value of first) {
			if (!second.includes(value)) return false;
		}

		return true;
	}

	/**
	 * Spreads the elements of the input array and returns the result.
	 *
	 * @param array The array to spread.
	 * @returns The spreaded array.
	 */
	export function clone<T extends defined[]>(array: T): T {
		return [...array] as T;
	}

	/**
	 * Shuffles the elements of the input array and returns the result.
	 * The input array is not modified.
	 *
	 * @param array The array to shuffle.
	 * @param random An optional random source.
	 * @returns The shuffled array.
	 */
	export function shuffle<T extends defined[]>(array: T, random = new Random()) {
		const shuffled = clone(array);

		for (let i = 0; i < shuffled.size(); i++) {
			const j = random.NextInteger(i, shuffled.size() - 1);
			const temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}

		return shuffled;
	}

	/**
	 * Returns the input array in reverse order.
	 * The input array is not modified.
	 *
	 * @param array The array to reverse.
	 * @returns The reversed array.
	 */
	export function reverse<T extends defined[]>(array: T) {
		const reversed = clone(array);

		for (let i = 0; i < reversed.size() / 2; i++) {
			const j = reversed.size() - i - 1;
			const temp = reversed[i];
			reversed[i] = reversed[j];
			reversed[j] = temp;
		}

		return reversed;
	}

	/**
	 * Returns the input array sliced down to the specified indices.
	 * The input array is not modified.
	 *
	 * @param array The array to slice.
	 * @param start The index to start at.
	 * @param stop The index to stop at.
	 * @returns The sliced array.
	 */
	export function slice<T extends defined[]>(array: T, start: number, stop?: number): T {
		const size = array.size();

		start = math.min(start, size);
		stop = stop === undefined ? size : math.min(stop + 1, size);

		const result = [];
		for (let i = start; i < stop; i++) result.push(array[i]);
		return result as T;
	}

	/**
	 * Returns the input array in lower case.
	 * The input array is not modified.
	 *
	 * @param array The array to lower case.
	 * @returns The lower cased array.
	 */
	export function lower<T extends string[]>(array: T) {
		return array.map((x) => x.lower());
	}

	/**
	 * Returns the input array in upper case.
	 * The input array is not modified.
	 *
	 * @param array The array to upper case.
	 * @returns The upper case array.
	 */
	export function upper<T extends string[]>(array: T) {
		return array.map((x) => x.upper());
	}

	/**
	 * Recursively flattens the input array such that all
	 * elements, not matter how deep, are placed in a single
	 * array. The input array is not modified.
	 *
	 * @param array The array to flatten.
	 * @returns The flattened array.
	 */
	export function flatten<T extends defined[]>(arr: T) {
		let flattened: UnpackedArray<T>[] = [];

		for (const item of arr) {
			if (typeIs(item, 'table')) {
				flattened = [...flattened, ...flatten(item as T)];
			} else flattened.push(item);
		}

		return flattened;
	}

	/**
	 * Asynchronously runs each callback in an array of callbacks with the
	 * given arguments.
	 *
	 * @param callbacks The array of callbacks to run.
	 * @param args The arguments to pass to each callback.
	 */
	export function run<T extends Callback>(callbacks: T[], ...args: Parameters<T>) {
		for (const cb of callbacks) task.spawn(cb, ...(args as unknown[]));
	}

	/**
	 * Synchronously runs each callback in an array of callbacks with the
	 * given arguments.
	 *
	 * @param callbacks The array of callbacks to run.
	 * @param args The arguments to pass to each callback.
	 */
	export function runSync<T extends Callback>(callbacks: T[], ...args: Parameters<T>) {
		for (const cb of callbacks) cb(...(args as unknown[]));
	}

	/**
	 * Returns whether the input value is a sequential array.
	 *
	 * @param value The value to check.
	 * @returns Whether the input is a sequential table.
	 */
	export function is(value: unknown): value is Array<unknown> {
		if (!typeIs(value, 'table')) return false;

		let i = 0;
		for (const _ of pairs(value)) {
			i = i + 1;
			if ((value as Record<number, unknown>)[i] === undefined) return false;
		}

		return true;
	}
}
