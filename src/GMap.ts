/**
 * A map that includes a getter to receive the value at a key when
 * the key is not present in the map.
 */
export class GMap<K, V> extends Map<K, V> {
	/**
	 * Constructs a new map with the given getter.
	 *
	 * @param getter A function that accepts a key and returns the value to be stored in the map.
	 * @param entries An optional array of key-value pairs to initialize the map with.
	 */
	public constructor(protected getter: (key: K) => V, ...entries: ReadonlyArray<readonly [K, V]>) {
		super(entries);
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
		const existing = super.get(key);
		if (existing !== undefined) return existing;

		const value = this.getter(key);
		this.set(key, value);
		return value;
	}
}
