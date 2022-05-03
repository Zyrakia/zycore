/**
 * A map that includes a getter to receive the value at a key when
 * the key is not present in the map.
 */
export class GMap<K, V> {
	protected map: Map<K, V>;

	/**
	 * Constructs a new map with the given getter.
	 *
	 * @param getter A function that accepts a key and returns the value to be stored in the map.
	 * @param entries An optional array of key-value pairs to initialize the map with.
	 */
	public constructor(protected getter: (key: K) => V, ...entries: ReadonlyArray<readonly [K, V]>) {
		this.map = new Map(entries);
	}

	/**
	 * Returns the value associated with the given key.
	 *
	 * If the key is not present in the map, the getter is called to
	 * generate the value.
	 *
	 * @param key The key to lookup.
	 * @returns The value associated with the key.
	 */
	public get(key: K) {
		const existing = this.map.get(key);
		if (existing !== undefined) return existing;

		const value = this.getter(key);
		this.map.set(key, value);
		return value;
	}

	/**
	 * Sets the value associated with the given key.
	 *
	 * @param key The key to set.
	 * @param value The value to set.
	 */
	public set(key: K, value: V) {
		this.map.set(key, value);
		return this;
	}

	/**
	 * Deletes the given key from the Map.
	 *
	 * @param key The key to delete.
	 * @returns Whether the key was deleted.
	 */
	public delete(key: K) {
		return this.map.delete(key);
	}

	/**
	 * Deletes all members of the Map.
	 */
	public clear() {
		this.map.clear();
		return this;
	}

	/**
	 * Returns a boolean for whether the given key exists in the Map.
	 *
	 * @param key The key to check.
	 * @returns Whether the key exists in the Map.
	 */
	public has(key: K) {
		return this.map.has(key);
	}

	/**
	 * Returns the number of elements in the Map.
	 */
	public size() {
		return this.map.size();
	}

	/**
	 * Performs the specified action for each (element / pair of elements) in the Map
	 * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time
	 * for each (element / pair of elements) in the array.
	 */
	public forEach(callbackfn: (value: V, key: K, self: ReadonlyMap<K, V>) => void) {
		this.map.forEach(callbackfn);
	}

	/**
	 * Returns true if empty, otherwise false.
	 */
	public isEmpty() {
		return this.map.isEmpty();
	}
}
