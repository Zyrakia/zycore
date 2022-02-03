import { Cache } from './Cache';

/**
 * A simple cache that holds values for each key and
 * ensures that each key exists when it is requested, by
 * addressing a customizable getter. It also has
 * an option to forget keys automatically after a
 * certain amount of time.
 */
export class GetterCache<K, V> extends Cache<K, V> {
	/**
	 * Creates a new cache.
	 *
	 * @param getter The getter to use to get a value for a key if it is not cached.
	 * @param expirationSeconds The number of seconds to cache values for, or omit to cache forever.
	 */
	public constructor(private getter: (key: K) => V, expirationSeconds?: number) {
		super(expirationSeconds);
	}

	/**
	 * Returns the value for a given key. If the key
	 * is not in the cache, it will be retrieved from the
	 * getter, cached, and returned. This will also start
	 * a forget timer if the getter ends up being called.
	 *
	 * @param key The key to retrieve the value for.
	 * @returns The value.
	 */
	public get(key: K) {
		return this.cache.get(key) || this.unseenGet(key);
	}

	/**
	 * Retrieves a value from the getter, and caches it.
	 * This will also start a forget timer.
	 *
	 * @param key The key to retrieve the value for.
	 * @returns The value.
	 */
	private unseenGet(key: K) {
		const value = this.getter(key);
		this.cache.set(key, value);
		this.startForgetting(key);
		return value;
	}

	/**
	 * Returns the current getter of the cache.
	 */
	public getGetter() {
		return this.getter;
	}

	/**
	 * Sets the getter that will be used to
	 * retrieve any values for future unseen keys.
	 *
	 * @param getter The new getter.
	 */
	public setGetter(getter: (key: K) => V) {
		this.getter = getter;
	}
}
