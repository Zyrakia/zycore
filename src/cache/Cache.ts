import { setTimeout, Timeout } from 'Interval';
import { Option } from 'Option';
import { Users } from 'Users';

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

	/**
	 * Wraps a function into the specified cache. This will, for each function call,
	 * check if the first parameter that was given is cached, and if so, returns the cached
	 * value. If it is not cached, it will return and cache the result of the
	 * passed in function.
	 *
	 * This internally stores the result in an `Option`, meaning results of `undefined`/`nil` are
	 * also cached.
	 *
	 * @param fn The function to wrap.
	 * @param cache The cache to use, defaults to just a new Cache.
	 * @returns A wrapper function with the same signature as the passed function.
	 */
	public static wrap<T extends Callback>(
		fn: T,
		cache = new Cache<Parameters<T>[0], Option<ReturnType<T>>>(),
	): (...args: Parameters<T>) => ReturnType<T> {
		return (...args: unknown[]) => {
			const key = args[0];
			const cachedResult = cache.get(key);
			if (cachedResult) return cachedResult.get();

			const result = fn(...args);
			cache.set(key, new Option(result));

			return result;
		};
	}
}
