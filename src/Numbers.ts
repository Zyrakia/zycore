export namespace Numbers {
	/**
	 * Creates a list of numbers between from and to (inclusive).
	 *
	 * @param from The start of the range.
	 * @param to The end of the range.
	 * @returns A list of numbers between from and to (inclusive).
	 */
	export function spread(from: number, to: number) {
		const numbers = [];
		for (let i = from; i <= to; i++) numbers.push(i);
		return numbers;
	}

	/**
	 * Returns the given list of numbers evenly spread out into a NumberSequence.
	 *
	 * @param numbers The list of numbers to spread out.
	 * @reutrns The spread out list of numbers.
	 */
	export function sequence(...numbers: number[]) {
		const size = numbers.size();
		if (size === 0) return new NumberSequence(0);
		else if (size === 1) return new NumberSequence(numbers[0]);

		const keypoints: NumberSequenceKeypoint[] = [];
		const timeSpacing = 1 / (size - 1);

		let i = 0;
		for (const number of numbers) {
			keypoints.push(new NumberSequenceKeypoint(i++ * timeSpacing, number));
		}

		return new NumberSequence(keypoints);
	}

	/**
	 * Returns whether the given number is an integer.
	 */
	export function isInteger(num: number) {
		return num % 1 === 0;
	}

	/**
	 * Returns whether the given number is even.
	 */
	export function isEven(num: number) {
		return num % 2 === 0;
	}

	/**
	 * Returns whether the given number is odd.
	 */
	export function isOdd(num: number) {
		return num % 2 === 1;
	}

	/**
	 * Returns the given number truncated to the amount of decimal places.
	 *
	 * @param num The number to truncate.
	 * @param decimals The amount of decimal places to truncate to.
	 * @returns The truncated number.
	 */
	export function truncate(num: number, decimals: number) {
		const multiplier = math.pow(10, decimals);
		return math.floor(num * multiplier) / multiplier;
	}

	/**
	 * Returns a random float between negative num and num.
	 *
	 * @param num The number to be used as the bound.
	 * @returns A random float between negative num and num.
	 */
	export function randomOffset(num: number) {
		const n = math.abs(num);
		return new Random().NextNumber(n * -1, n);
	}

	const generatedIds = new Set<number>();

	/**
	 * Generates a unique number within the session.
	 *
	 * @returns A session-unique number.
	 */
	export function SUID(): number {
		const ID = new Random().NextNumber(0, 999999999999999);
		if (generatedIds.has(ID)) return SUID();
		generatedIds.add(ID);
		return ID;
	}
}
