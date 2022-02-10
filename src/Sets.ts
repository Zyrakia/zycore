export namespace Sets {
	/**
	 * Iterates over the given set and asynchronously calls the given
	 * function on each item. This passes the item to itself when
	 * spawning the function, meaning it is meant to act as you
	 * calling a function through `object:name()` instead of `object.name()`.
	 *
	 * @param set The set to iterate over.
	 * @param key The key of the function to run.
	 * @param args The arguments to pass to the function.
	 */
	export function runSet<T, K extends keyof T>(
		set: Set<T>,
		key: K,
		...args: T[K] extends Callback ? Parameters<T[K]> : never
	) {
		for (const item of set) {
			const callback = item[key];
			if (!typeIs(callback, 'function')) continue;
			task.spawn(callback, item, ...(args as unknown[]));
		}
	}

	/**
	 * Iterates over the given set and synchronously calls the given
	 * function on each item. This passes the item to itself
	 * when calling the function, meaning it is meant to act as you
	 * calling a function through `object:name()` instead of `object.name()`.
	 *
	 * @param set The set to iterate over.
	 * @param key The key of the function to run.
	 * @param args The arguments to pass to the function.
	 */
	export function runSetSync<T, K extends keyof T>(
		set: Set<T>,
		key: K,
		...args: T[K] extends Callback ? Parameters<T[K]> : never
	) {
		for (const item of set) {
			const callback = item[key];
			if (!typeIs(callback, 'function')) continue;
			callback(item, ...(args as unknown[]));
		}
	}

	/**
	 * Iterates over the given set and asynchronously calls each
	 * element in the set.
	 *
	 * @param set The set to iterate over.
	 * @param args The arguments to pass to each callback.
	 */
	export function runNoKey<T extends (...args: unknown[]) => void>(set: Set<T>, ...args: Parameters<T>) {
		for (const item of set) task.spawn(item, ...args);
	}

	/**
	 * Iterates over the given set and synchronously calls each
	 * element in the set.
	 *
	 * @param set The set to iterate over.
	 * @param args The arguments to pass to each callback.
	 */
	export function runNoKeySync<T extends (...args: unknown[]) => void>(set: Set<T>, ...args: Parameters<T>) {
		for (const item of set) item(...args);
	}

	/**
	 * Picks a random element from the given set.
	 *
	 * @param set The set to pick from.
	 * @param random An optional random instance.
	 * @returns The random element.
	 */
	export function pickRandom<T>(set: Set<T>, random = new Random()) {
		const index = random.NextInteger(0, set.size() - 1);
		let i = -1;
		for (const item of set) if (i++ === index) return item;
	}
}
