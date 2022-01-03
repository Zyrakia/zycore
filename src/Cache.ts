import { setTimeout, Timeout } from 'Interval';

/**
 * A simple cache that stores values for a certain amount of time,
 * and calls a getter every time the value is requested and not
 * in the cache.
 */
export class Cache<T, K> {
	/** The cache mapping. */
	private cache = new Map<T, K>();

	/** The forget timeout mapping. */
	private timeouts = new Map<T, Timeout>();

	/**
	 * Creates a new cache.
	 *
	 * @param getter The getter to use to get a value for a key if it is not cached.
	 * @param expirationSeconds The number of seconds to cache values for, or undefined to cache forever.
	 */
	public constructor(private getter: (key: T) => K, private expirationSeconds?: number) {}

	/**
	 * Retrieves a value from the cache.
	 * If the value is not in the cache, it will be retrieved from the getter.
	 *
	 * @param key The key to retrieve the value for.
	 * @returns The value.
	 */
	public get(key: T) {
		return this.cache.get(key) ?? this.unseenGet(key);
	}

	/**
	 * Forces a specific value to be cached, regardless of the getter.
	 *
	 * @param key The key to cache the value for.
	 * @param value The value to cache.
	 * @param forgettable Whether a forget timeout should be started for the value.
	 */
	public set(key: T, value: K, forgettable = true) {
		this.cache.set(key, value);
		if (forgettable) this.startForgetting(key);
	}

	/**
	 * Checks if the cache contains a value for a key.
	 *
	 * @param key The key to check for.
	 * @returns Whether the cache contains a value for the key.
	 */
	public has(key: T) {
		return this.cache.has(key);
	}

	/**
	 * Retrieves a value from the getter, and caches it.
	 * This will also start a forget timer.
	 *
	 * @param key The key to retrieve the value for.
	 * @returns The value.
	 */
	private unseenGet(key: T) {
		const value = this.getter(key);
		this.cache.set(key, value);
		this.startForgetting(key);
		return value;
	}

	/**
	 * Cancels any active forget timers for a key and
	 * starts a new one.
	 *
	 * @param key The key to start a forget timer for.
	 */
	private startForgetting(key: T) {
		if (this.expirationSeconds === undefined) return;

		const timeout = this.timeouts.get(key);
		timeout?.destroy();

		const newTimeout = setTimeout(() => {
			this.cache.delete(key);
			this.timeouts.delete(key);
		}, this.expirationSeconds);

		this.timeouts.set(key, newTimeout);
	}

	/**
	 * Forces the cache to forget a key.
	 * This means the next time the key is requested,
	 * the getter will be called.
	 *
	 * @param key The key to forget.
	 * @returns Whether the key was forgotten.
	 */
	public forget(key: T) {
		this.timeouts.delete(key);
		return this.cache.delete(key);
	}

	/**
	 * Clears the cache and any forget timers.
	 */
	public clear() {
		this.cache.clear();
		this.timeouts.clear();
	}

	/**
	 * Returns the current expiration seconds.
	 */
	public getExpirationSeconds() {
		return this.expirationSeconds;
	}

	/**
	 * Sets the expiration seconds that will be
	 * used for any new forget timers.
	 *
	 * @param expirationSeconds The expiration seconds.
	 */
	public setExpirationSeconds(seconds: number) {
		this.expirationSeconds = seconds;
	}

	/**
	 * Sets the getter that will be used to get any
	 * new values.
	 *
	 * @param getter The getter.
	 */
	public setGetter(getter: (key: T) => K) {
		this.getter = getter;
	}
}
