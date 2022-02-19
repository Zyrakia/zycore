import { InstanceCollection } from './InstanceCollection';

/**
 * A set that tracks instances, and automatically removes an instance
 * when it is removed from the game.
 */
export class InstanceMap<U, T extends Instance = Instance> extends InstanceCollection<T> {
	/** The map that holds all instances. */
	private map = new Map<T, U>();

	/**
	 * Sets the value associated with the given instance, this
	 * value can be retrieved later with {@link get()}. This
	 * also connects to the removal of the instance if it
	 * has not yet been tracked.
	 *
	 * @param instance The instance to set the value for.
	 * @param value The value to set.
	 */
	public set(instance: T, value: U) {
		this.map.set(instance, value);
		this.bindTo(instance, () => this.map.delete(instance));
		return this;
	}

	/**
	 * Returns the value associated with the given instance.
	 *
	 * @param instance The instance to get the value for.
	 * @returns The associated value.
	 */
	public get(instance: T) {
		return this.map.get(instance);
	}

	/**
	 * Deletes an instance from the map, and disconnects from the
	 * removal of the instance.
	 *
	 * @param instance The instance to delete.
	 */
	public delete(instance: T) {
		return this.unbindFrom(instance);
	}

	/**
	 * Returns whether the map contains the instance.
	 *
	 * @param instance The instance to check.
	 */
	public has(instance: T) {
		return this.map.has(instance);
	}

	/**
	 * Clears the map and disconnects from the removal
	 * of all tracked instances.
	 */
	public clear() {
		this.map.clear();
		this.unbindFromAll();
		return this;
	}

	/**
	 * Returns whether the map is empty.
	 */
	public isEmpty() {
		return this.map.isEmpty();
	}

	/**
	 * Returns the size of the map.
	 */
	public size() {
		return this.map.size();
	}

	/**
	 * Calls the specified callback for each pair in the map.
	 */
	public forEach(callback: (value: U, key: T, self: this) => void) {
		this.map.forEach((v, k) => callback(v, k, this));
		return this;
	}
}
