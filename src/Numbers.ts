import { Make } from '@rbxts/altmake';
import { TweenService } from '@rbxts/services';
import { Arrays } from 'Arrays';

export namespace Numbers {
	/**
	 * Creates a list of numbers between from and to (inclusive).
	 *
	 * @param from The start of the range.
	 * @param to The end of the range.
	 * @param jump The amount to increase each step, defaults to 1.
	 * @returns A list of numbers between from and to (inclusive).
	 */
	export function spread(from: number, to: number, jump = 1) {
		const numbers = [];
		for (let i = from; i <= to; i += jump) numbers.push(i);
		return numbers;
	}

	/**
	 * Returns the given list of numbers evenly spread out into a NumberSequence.
	 *
	 * @param numbers The list of numbers to spread out.
	 * @returns The spread out list of numbers.
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
	 * Creates a number sequence out of the specified entries.
	 * Each entry is a tuple of a time at 0, value at 1, and optional
	 * envelope at 2.
	 *
	 * @param entries The entries to map into keypoints.
	 * @returns The number sequence.
	 */
	export function manualSequence(...entries: [time: number, value: number, envelope?: number][]) {
		const keypoints = entries.map((entry) => new NumberSequenceKeypoint(entry[0], entry[1], entry[2]));
		return new NumberSequence(keypoints);
	}

	/**
	 * Returns a tween that will tween a number sequence containing
	 * the `from` value to a number sequence containing the `to` value.
	 *
	 * Under the hood, it tweens the `Value` property of a number value and
	 * listens to the change to create a new number sequence to send to the
	 * `onStep` callback.
	 *
	 * @param from The number to start at.
	 * @param to The number to stop at.
	 * @param info The tween info to tween with.
	 * @param onStep The function called for each time the value changes.
	 * @returns The tween, in order to begin you must play the tween.
	 */
	export function sequenceTween(
		from: number,
		to: number,
		info: TweenInfo,
		onStep: (sequence: NumberSequence) => void,
	) {
		const value = Make('NumberValue', { Value: from });

		let stepSequence = new NumberSequence(from);
		value.Changed.Connect((v) => {
			stepSequence = new NumberSequence(v);
			onStep(stepSequence);
		});

		const tween = TweenService.Create(value, info, { Value: to });
		tween.Completed.Connect(() => {
			value.Destroy();
			tween.Destroy();
		});

		return tween;
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
	 * Rounds num up to the nearest multiple of n.
	 *
	 * @param num The number to round up.
	 * @param n The multiple to round up to.
	 * @returns The rounded number.
	 */
	export function roundUpMultiple(num: number, n: number) {
		if (num % n === 0) return num;

		const remainder = num % n;
		return num - remainder + n;
	}

	/**
	 * Rounds num down to the nearest multiple of n.
	 *
	 * @param num The number to round down.
	 * @param n The multiple to round down to.
	 * @returns The rounded number.
	 */
	export function roundDownMultiple(num: number, n: number) {
		if (num % n === 0) return num;

		const remainder = num % n;
		return num - remainder;
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
	export function randomOffset(num: number, r = new Random()) {
		const n = math.abs(num);
		return r.NextNumber(n * -1, n);
	}

	/**
	 * Returns a random float between:
	 * (num - num / 2) and (num + num / 2)
	 *
	 * Example:
	 * ```ts
	 * randomRange(1) // returns float between 0.5 and 1.5
	 * randomRange(10) // returns float between 5 and 15
	 * ```
	 *
	 * @param num The number to be used as the bound.
	 * @returns A random float between:
	 */
	export function randomRange(num: number, r = new Random()) {
		return r.NextNumber(num - num / 2, num + num / 2);
	}

	/**
	 * Returns a random number between min and max.
	 *
	 * @param min The minimum number.
	 * @param max The maximum number.
	 * @returns A random number between min and max.
	 */
	export function random(min: number, max: number, r = new Random()) {
		return r.NextNumber(min, max);
	}

	/**
	 * Maps a value from one range to another.
	 *
	 * @param num The value to map.
	 * @param from The range to map from.
	 * @param to The range to map to.
	 * @returns The mapped value.
	 */
	export function map(num: number, from: [number, number], to: [number, number]) {
		return ((num - from[0]) * (to[1] - to[0])) / (from[1] - from[0]) + to[0];
	}

	/**
	 * Unmaps a value mapped with {@link map}.
	 *
	 * @param num The value to unmap.
	 * @param from The from range used to map.
	 * @param to The to range used to map.
	 * @returns The unmapped value.
	 */
	export function unmap(num: number, from: [number, number], to: [number, number]) {
		return ((num - to[0]) * (from[1] - from[0])) / (to[1] - to[0]) + from[0];
	}

	/**
	 * Returns a number formatted by separating
	 * the thousands with commas.
	 *
	 * @param num The number to format.
	 * @returns The formatted number.
	 */
	export function format(num: number) {
		const [number, fraction] = tostring(num).gsub('-', '')[0].split('.');

		return (
			(num < 0 ? '-' : '') +
			Arrays.putEvery(number.reverse().split(''), 3, ',').join('').reverse() +
			(fraction ? '.' + fraction : '')
		);
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
