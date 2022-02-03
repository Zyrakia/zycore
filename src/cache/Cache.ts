import { setTimeout, Timeout } from 'Interval';

/**
 * The base class for caches that hold values for each key
 * and can be configured to forget keys after a certain amount.
 */
export class Cache<K, V> {
	/** The cache mapping. */
	protected cache = new Map<K, V>();

	/** The forget timeout mapping. */
	protected timeouts = new Map<K, Timeout>();

	/**
	 * Creates a new cache.
	 *
	 * @param expirationSeconds The number of seconds to cache values for, or omit to cache forever.
	 */
	public constructor(private expirationSeconds?: number) {}

	/**
	 * Returns the value for a given key.
	 *
	 * @param key The key to retrieve the value for.
	 * @returns The value, or undefined if it is not in the cache.
	 */
	public get(key: K) {
		return this.cache.get(key);
	}

	/**
	 * Forces a specific value to be cached for a key,
	 * regardless of the getter. Unless forgettable is false,
	 * this will start a new forget timeout for the key. If it is
	 * false, any existing forget timeout will be stopped, and
	 * no new one will be started.
	 *
	 * @param key The key to cache the value for.
	 * @param value The value to cache.
	 * @param forgettable Whether a forget timeout should be started for the value. Defaults to true.
	 */
	public set(key: K, value: V, forgettable = true) {
		this.cache.set(key, value);
		if (forgettable) this.startForgetting(key);
		else this.stopForgetting(key);
	}

	/**
	 * Returns whether the cache contains a value for a key.
	 *
	 * @param key The key to check for.
	 * @returns Whether the cache contains a value for the key.
	 */
	public has(key: K) {
		return this.cache.has(key);
	}

	/**
	 * Forces the cache to forget a key, deleting
	 * it from the cache and stopping any associated
	 * timeout.
	 *
	 * @param key The key to forget.
	 * @returns Whether the key was forgotten (if it was in the cache).
	 */
	public forget(key: K) {
		this.stopForgetting(key);
		return this.cache.delete(key);
	}

	/**
	 * Calls the {@link forget} method for all keys in the cache.
	 */
	public forgetAll() {
		this.cache.forEach((_, key) => this.forget(key));
	}

	/**
	 * Starts a forget timeout for a key. This does nothing
	 * if the cache is configured to not forget keys.
	 * This cancels the existing timeout if there is one.
	 *
	 * @param key The key to start the forget timeout for.
	 */
	protected startForgetting(key: K) {
		if (this.expirationSeconds === undefined) return;

		this.stopForgetting(key);

		const timeout = setTimeout(() => {
			this.forget(key);
		}, this.expirationSeconds);

		this.timeouts.set(key, timeout);
	}

	/**
	 * Stops the forget timeout for a key.
	 *
	 * @param key The key to stop the forget timeout for.
	 * @returns Whether the timeout was stopped.
	 */
	protected stopForgetting(key: K) {
		const timeout = this.timeouts.get(key);
		if (!timeout) return;
		timeout.destroy();
		return this.timeouts.delete(key);
	}

	/**
	 * Calls the {@link stopForgetting} method for all keys in the timeout map.
	 */
	private stopForgettingAll() {
		this.timeouts.forEach((_, key) => this.stopForgetting(key));
	}

	/**
	 * Returns the configured expiration seconds.
	 */
	public getExpirationSeconds() {
		return this.expirationSeconds;
	}

	/**
	 * Sets the expiration seconds of the cache.
	 * If it is set to nothing, all active forget timeouts
	 * will be stopped, and keys will be cached forever.
	 *
	 * If it is set to a number, it will only affect new
	 * forget timeouts, no existing ones will be stopped
	 * or adjusted.
	 */
	public setExpirationSeconds(seconds?: number) {
		this.expirationSeconds = seconds;
		if (seconds === undefined) this.stopForgettingAll();
	}
}
