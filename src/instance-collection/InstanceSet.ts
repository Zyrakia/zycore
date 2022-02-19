import { InstanceCollection } from './InstanceCollection';

/**
 * A set that tracks instances, and automatically removes an instance
 * when it is removed from the game.
 */
export class InstanceSet<T extends Instance = Instance> extends InstanceCollection<T> {
	/** The set that holds all instances. */
	private set = new Set<T>();

	/**
	 * Adds an instance to the set and connects to the removal
	 * of the instance.
	 *
	 * @param instance The instance to add.
	 */
	public add(instance: T) {
		this.set.add(instance);
		this.bindTo(instance, () => this.set.delete(instance));
		return this;
	}

	/**
	 * Deletes an instance from the set, and disconnects from the
	 * removal of the instance.
	 *
	 * @param instance The instance to delete.
	 */
	public delete(instance: T) {
		return this.unbindFrom(instance);
	}

	/**
	 * Returns whether the set contains the instance.
	 *
	 * @param instance The instance to check.
	 */
	public has(instance: T) {
		return this.set.has(instance);
	}

	/**
	 * Clears the set and disconnects from the removal of all
	 * tracked instances.
	 */
	public clear() {
		this.set.clear();
		this.unbindFromAll();
		return this;
	}

	/**
	 * Returns whether the set is empty.
	 */
	public isEmpty() {
		return this.set.isEmpty();
	}

	/**
	 * Returns the size of the set.
	 */
	public size() {
		return this.set.size();
	}

	/**
	 * Calls the specified callback for each instance in the set.
	 */
	public forEach(callback: (instance: T, instanceTwo: T, self: this) => void) {
		this.set.forEach((v, v2) => callback(v, v2, this));
		return this;
	}
}
