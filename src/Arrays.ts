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
	 * Spreads the elements of the input array and returns the result.
	 *
	 * @param array The array to spread.
	 * @returns The spreaded array.
	 */
	export function clone<T extends defined[]>(array: T) {
		return [...array];
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
}
