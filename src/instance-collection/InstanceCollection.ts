import { Bin } from '@rbxts/bin';
import { BinMap } from 'BinMap';

/**
 * The base class for all instance-bound collections.
 */
export class InstanceCollection<T extends Instance> {
	/** Keeps track of a bin for each instance, the bin contains the relevant connections. */
	private bins = new BinMap<T>();

	/**
	 * Creates a connection between the instance and the collection,
	 * and tracks the instance until it is removed from the game.
	 *
	 * If this instance is not already tracked, the passed item
	 * will be linked to the instance removal.
	 *
	 * @param instance The instance to track.
	 * @param item The item to link to the instance.
	 */
	protected bindTo(instance: T, item: Bin.Item) {
		if (this.bins.has(instance)) return;
		this.bins.add(instance, () => this.unbindFrom(instance));

		const conn = instance.AncestryChanged.Connect((_, parent) => {
			if (parent) return;
			this.unbindFrom(instance);
		});

		this.bins.add(instance, conn);
		this.bins.add(instance, item);
	}

	/**
	 * If existing, destroys the connection between the instance and the collection.
	 *
	 * @param instance The instance to unbind.
	 */
	protected unbindFrom(instance: T) {
		return this.bins.delete(instance);
	}

	/**
	 * For each tracked instance, destroys the connection between
	 * the instance and the collection.
	 */
	protected unbindFromAll() {
		this.bins.deleteAll();
	}

	/**
	 * Adds an item to the removal bin of an instance.
	 *
	 * @param instance The instance to link the item to.
	 * @param item The item to link to the instance.
	 */
	public onRemoval(instance: T, item: Bin.Item) {
		if (!this.bins.has(instance)) return;
		this.bins.add(instance, item);
		return this;
	}
}
