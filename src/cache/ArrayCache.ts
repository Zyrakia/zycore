import { Cache } from './Cache';

/**
 * A simple cache that holds arrays for each key and provides
 * specialized methods for interacting with said array. It also has
 * an option to forget keys automatically after a certain
 * amount of time.
 */
export class ArrayCache<K, V> extends Cache<K, V[]> {
	/**
	 * Adds a value to a key, ensuring that the key exists.
	 * This means that if the key does not exist, it will be created.
	 * This will start a new forget timeout for the key.
	 *
	 * @param key The key to add the value to.
	 * @param value The value to add.
	 */
	public add(key: K, value: V) {
		const array = this.ensureGet(key);
		this.set(key, [...array, value]);
	}

	/**
	 * Checks if the array at a key contains a value.
	 * If the cache does not contain the key, it will return false.
	 *
	 * @param key The key to check.
	 * @param value The value to check for.
	 * @returns Whether the array contains the value.
	 */
	public contains(key: K, value: V) {
		const array = this.get(key);
		if (!array) return false;
		return array.includes(value);
	}

	/**
	 * Retrieves an array from the cache, if it does
	 * not exist it will create a new one, set it, and
	 * then return it.
	 *
	 * @param key The key to retrieve the array for.
	 * @returns The array.
	 */
	private ensureGet(key: K) {
		const existing = this.get(key);
		if (existing) return existing;

		const array: V[] = [];
		this.cache.set(key, array);
		return array;
	}
}
