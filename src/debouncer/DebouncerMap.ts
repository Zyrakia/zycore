import { Debouncer } from 'debouncer/Debouncer';

/**
 * A utility class that tracks debouncers attached to keys.
 * Debouncers are ensured to exist with every operation.
 */
export class DebouncerMap<T> {
	private map = new Map<T, Debouncer>();

	/**
	 * Creates a new debouncer map.
	 *
	 * @param timeout The timeout in seconds.
	 */
	public constructor(private timeout: number) {}

	/**
	 * Tries to pass the debouncer.
	 * This will set the last time to the current time if it passes.
	 *
	 * @param key The key of the debouncer.
	 * @returns Whether the debouncer passed.
	 */
	public try(key: T) {
		return this.getDebouncer(key).try();
	}

	/**
	 * Checks whether the debouncer can pass.
	 * This will NOT set the last time to the current time.
	 *
	 * @param key The key of the debouncer.
	 * @returns Whether the debouncer can pass.
	 */
	public check(key: T) {
		return this.getDebouncer(key).check();
	}

	/**
	 * Locks the debouncer.
	 * This will prevent the debouncer from passing.
	 *
	 * @param key The key of the debouncer.
	 */
	public lock(key: T) {
		this.getDebouncer(key).lock();
	}

	/**
	 * Locks all active debouncers.
	 * This will prevent all debouncers from passing.
	 * This will NOT lock new debouncers.
	 */
	public lockAll() {
		for (const [, debouncer] of this.map) {
			debouncer.lock();
		}
	}

	/**
	 * Unlocks the debouncer.
	 * This will allow the debouncer to pass.
	 */
	public unlock(key: T) {
		this.getDebouncer(key).unlock();
	}

	/**
	 * Unlocks all active debouncers.
	 * This will allow all debouncers to pass.
	 */
	public unlockAll() {
		for (const [, debouncer] of this.map) {
			debouncer.unlock();
		}
	}

	/**
	 * Returns whether the debouncer is locked.
	 *
	 * @param key The key of the debouncer.
	 */
	public isLocked(key: T) {
		return this.getDebouncer(key).isLocked();
	}

	/**
	 * Clears all active debouncers.
	 */
	public clear() {
		this.map.clear();
	}

	/**
	 * Delete a debouncer.
	 *
	 * @param key The key of the debouncer.
	 * @returns Whether the debouncer was deleted.
	 */
	public delete(key: T) {
		return this.map.delete(key);
	}

	/**
	 * Sets the timeout of a debouncer.
	 *
	 * @param key The key of the debouncer.
	 * @param timeout The timeout in seconds.
	 */
	public setTimeout(key: T, timeout: number) {
		this.getDebouncer(key).setTimeout(timeout);
	}

	/**
	 * Sets the timeout of all debouncers.
	 *
	 * @param timeout The timeout in seconds.
	 */
	public setTimeoutAll(timeout: number) {
		this.timeout = timeout;
		for (const [, debouncer] of this.map) {
			debouncer.setTimeout(this.timeout);
		}
	}

	/**
	 * Resets the debouncer.
	 *
	 * @param key The key of the debouncer.
	 */
	public reset(key: T) {
		this.getDebouncer(key).reset();
	}

	/**
	 * Resets all debouncers.
	 */
	public resetAll() {
		for (const [, debouncer] of this.map) {
			debouncer.reset();
		}
	}

	/**
	 * Returns the timeout of the debouncer.
	 *
	 * @param key The key of the debouncer.
	 * @returns The timeout of the debouncer.
	 */
	public getTimeout(key: T) {
		return this.getDebouncer(key).getTimeout();
	}

	/**
	 * Returns the default timeout of the debouncers.
	 */
	public getTimeoutAll() {
		return this.timeout;
	}

	/**
	 * Returns the last time the debouncer passed.
	 *
	 * @param key The key of the debouncer.
	 * @returns The last time the debouncer passed.
	 */
	public getLast(key: T) {
		return this.getDebouncer(key).getLast();
	}

	/**
	 * Returns whether the map has an
	 * active debouncer for the key.
	 *
	 * @param key The key of the debouncer.
	 * @returns Whether the map has an active debouncer for the key.
	 */
	public has(key: T) {
		return this.map.has(key);
	}

	/**
	 * Gets the debouncer for the key.
	 *
	 * @param key The key of the debouncer.
	 * @returns The debouncer for the key.
	 */
	public getDebouncer(key: T) {
		let debouncer = this.map.get(key);

		if (!debouncer) {
			debouncer = new Debouncer(this.timeout);
			this.map.set(key, debouncer);
		}

		return debouncer;
	}

	/**
	 * Returns the iterator of the internal map.
	 */
	public [Symbol.iterator]() {
		return this.map[Symbol.iterator]();
	}
}
