import { Bin } from '@rbxts/bin';

/**
 * A utility class that tracks bins attached to keys.
 * Bins are ensured to exist with every operation.
 */
export class BinMap<T> {
	private map = new Map<T, Bin>();

	/**
	 * Adds an item into the specified bin.
	 *
	 * @param key The key of the bin.
	 * @param item The item to add.
	 * @returns The item.
	 */
	public add(key: T, item: Bin.Item) {
		return this.getBin(key).add(item);
	}

	/**
	 * Adds the item into all active bins.
	 *
	 * @param item The item to add.
	 */
	public addAll(item: Bin.Item) {
		for (const [, bin] of this.map) bin.add(item);
	}

	/**
	 * Destroys the specified bin.
	 *
	 * @param key The key of the bin.
	 */
	public destroy(key: T) {
		this.getBin(key).destroy();
	}

	/**
	 * Destroys all active bins.
	 */
	public destroyAll() {
		for (const [, bin] of this.map) bin.destroy();
	}

	/**
	 * Destroys the specified bin and then removes it from the map.
	 *
	 * @param key The key of the bin.
	 * @returns Whether the bin was deleted.
	 */
	public delete(key: T) {
		this.getBin(key).destroy();
		return this.map.delete(key);
	}

	/**
	 * Destroys and deletes all acive bins.
	 */
	public deleteAll() {
		for (const [, bin] of this.map) bin.destroy();
		this.map.clear();
	}

	/**
	 * Checks whether the specified bin is empty.
	 *
	 * @param key The key of the bin.
	 * @returns Whether the bin is empty.
	 */
	public isEmpty(key: T) {
		return this.getBin(key).isEmpty();
	}

	/**
	 * Returns whether the map has an active bin
	 * for the specified key.
	 *
	 * @param key The key of the bin.
	 * @returns Whether the map has an active bin
	 */
	public has(key: T) {
		return this.map.has(key);
	}

	/**
	 * Gets the bin for the key.
	 *
	 * @param key The key of the bin.
	 * @returns The bin for the key.
	 */
	public getBin(key: T) {
		let bin = this.map.get(key);

		if (!bin) {
			bin = new Bin();
			this.map.set(key, bin);
		}

		return bin;
	}
}
