import { Bin } from '@rbxts/bin';
import { Ping } from '@rbxts/ping';

/**
 * A utility class to watch a specific instance
 * for when a specific type of child is added or removed.
 */
export class ClassWatcher<T extends keyof Instances> {
	private isDestroyed = false;
	private bin = new Bin();

	private addedPing = new Ping<[instance: Instances[T], trash: (item: Bin.Item) => void]>();
	private removedPing = new Ping<[instance: Instances[T]]>();

	/** A ping that fires every time the class type is added to the watched instance. */
	public readonly onAdded = this.addedPing.connector;

	/** A ping that fires every time the class type is removed from the watched instance. */
	public readonly onRemoved = this.removedPing.connector;

	/** The current instance watched by this  */
	private currentInstance?: Instances[T];

	/** The bin that can be used by the user to perform cleanup when the watcher switches instances. */
	private currentInstanceBin = new Bin();

	/**
	 * Constructs a new ClassWatcher tied to the given instance.
	 * In order to start watching the instance, call {@link watch}.
	 *
	 * Before calling watch, you should connect to the pings
	 * you need to listen to since watch will fire for
	 * the found existing class immediately if desired.
	 *
	 * @param watchedInstance The instance to watch.
	 * @param className The class type to watch for
	 * @param existing Whether to fire for an existing child of the specified class type. Defaults to true.
	 */
	public constructor(private watchedInstance: Instance, private className: T, private existing = true) {}

	/**
	 * Starts watching the instance for the given class type and if desired,
	 * fires immediately if an existing child of the given class type is found.
	 */
	public watch() {
		this.linkTo(this.watchedInstance);
	}

	/**
	 * Sets the instance that this watcher is watching. This
	 * will clear all connections relating to the previous
	 * instance and start watching the new instance. It will also
	 * clear the current instance, performing any cleanup associated
	 * with the previous instance.
	 *
	 * This will fire if an existing child of the given class type is found
	 * if specified in the constructor.
	 *
	 * This will do nothing if the instance is already being watched.
	 *
	 * @param instance The instance to watch.
	 */
	public setWatchedInstance(instance: Instance) {
		if (this.watchedInstance === instance) return;
		this.bin.destroy();
		this.clearCurrent();
		this.linkTo(instance);
	}

	/**
	 * Links the watcher to the given instance,
	 * creating all events necessary to watch
	 * for the given class type.
	 */
	private linkTo(instance: Instance) {
		if (!this.bin.isEmpty()) return;
		if (this.isDestroyed) throw 'ClassWatcher is destroyed.';
		this.watchedInstance = instance;

		const added = instance.ChildAdded.Connect((child) => {
			if (!child.IsA(this.className)) return;
			this.added(child);
		});

		const removed = instance.ChildRemoved.Connect((child) => {
			if (!child.IsA(this.className)) return;
			this.removed(child);
		});

		this.bin.add(added);
		this.bin.add(removed);

		if (this.existing) {
			const child = instance.FindFirstChildOfClass(this.className);
			if (child) this.added(child);
		}
	}

	/**
	 * Fires when a child of the watched instance is added that is
	 * of the given class type. This handles the linking of the current
	 * instance and alerting of any changes if necessary.
	 *
	 * @param child The child that was added.
	 */
	private async added(child: Instances[T]) {
		if (!this.currentInstanceBin.isEmpty() || this.currentInstance === child) return;

		this.currentInstance = child;
		this.currentInstanceBin = new Bin();

		const trash = (item: Bin.Item) => this.currentInstanceBin.add(item);
		this.addedPing.fire(child, trash);
	}

	/**
	 * Fires when a child of the watched instance is removed that is
	 * of the given class type. This handles the cleanup of the current
	 * instance and alerting of any changes if necessary.
	 *
	 * @param child The child that was removed.
	 */
	private async removed(child: Instances[T]) {
		if (this.currentInstance !== child) return;
		this.clearCurrent();
		this.removedPing.fire(child);
	}

	/**
	 * Clears the current instance and performs any cleanup
	 * associated with the instance, this will not
	 * fire any events, but will prevent the removed event
	 * firing if the instance ends up being removed.
	 */
	public clearCurrent() {
		this.currentInstance = undefined;
		this.currentInstanceBin.destroy();
	}

	/**
	 * Returns the current instance that was found.
	 */
	public getCurrent() {
		return this.currentInstance;
	}

	/**
	 * Completely destroys the watcher, this will
	 * remove all connections and clear the current
	 * instance. No events will be fired by using this,
	 * or after this. This will make the watcher
	 * unusable, throwing an error if asked
	 * to watch again.
	 */
	public destroy() {
		if (this.isDestroyed) return;
		this.isDestroyed = true;
		this.bin.destroy();
		this.clearCurrent();
		this.addedPing.destroy();
		this.removedPing.destroy();
	}
}
