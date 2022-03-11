type Flusher<T> = (item: T) => void;

/**
 * A Queue structure that can be used to enforce FIFO and supports
 * automatic flushing and max size enforcement.
 */
export class Queue<T> {
	private items = new Array<T>();
	private maxItems?: number;

	private flusher?: Flusher<T>;
	private shouldAutoFlush = false;
	private isFlushing = false;

	/**
	 * Constructs a new Queue.
	 *
	 * @param maxItems The maximum number of items that can be stored in the queue, or undefined if there is no maximum.
	 * @param initialItems The initial items to add to the queue.
	 */
	public constructor(maxItems?: number, ...initialItems: T[]) {
		this.items = initialItems;
		this.maxItems = maxItems;
	}

	/**
	 * Attempts to push all of the specified items into the queue.
	 * If the queue is full, the remaining items will be dropped.
	 *
	 * If auto flushing is enabled and the queue is not currently
	 * flushing, this will automatically flush the queue once all
	 * possible items have been added.
	 *
	 * @param items The items to push into the queue.
	 * @returns The number of items that were successfully pushed.
	 */
	public push(...items: T[]) {
		let inserted = 0;

		while (!this.isFull()) {
			const item = items[inserted];
			if (item === undefined) break;

			this.items.push(item);
			inserted++;
		}

		if (!this.isEmpty()) this.autoFlush();
		return inserted;
	}

	/**
	 * Dequeues and returns the item at the front of the queue.
	 */
	public pop() {
		return this.items.shift();
	}

	/**
	 * Returns the item at the specified index in the queue, by default
	 * the item at the front of the queue. This does not remove the item.
	 *
	 * @param index The index of the item to return.
	 */
	public peek(index = 0) {
		return this.items[index] as T | undefined;
	}

	/**
	 * Flushes the queue by calling the flusher function for each item in the queue.
	 * If the flusher function is not set, this simply clears the queue.
	 */
	public flush() {
		if (!this.flusher) return this.clear();

		this.isFlushing = true;

		try {
			let item = this.pop();
			while (item !== undefined) {
				this.flusher(item);
				item = this.pop();
			}
		} finally {
			this.isFlushing = false;
		}

		return this;
	}

	/**
	 * Attempts to automatically flush the queue if auto flushing is enabled and
	 * the queue is not currently flushing. This starts the flush asynchronously.
	 */
	private autoFlush() {
		if (!this.shouldAutoFlush || this.isFlushing) return;
		task.spawn(() => this.flush());
	}

	/**
	 * Sets the maximum amount of items that can be stored in the queue.
	 * If the queue is larger than this, items will be dropped from the front.
	 *
	 * @param maxItems The maximum amount of items that can be stored in the queue, or undefined if there is no maximum.
	 */
	public setMaxItems(maxItems?: number) {
		this.maxItems = maxItems;
		while (this.isFull) this.pop();
		return this;
	}

	/**
	 * Returns the maximum amount of items this queue can hold.
	 */
	public getMaxItems() {
		return this.maxItems;
	}

	/**
	 * Sets the flusher function to be called when the queue is flushed.
	 */
	public setFlusher(flusher?: Flusher<T>) {
		this.flusher = flusher;
		return this;
	}

	/**
	 * Returns the current flusher of the queue.
	 */
	public getFlusher() {
		return this.flusher;
	}

	/**
	 * Sets whether the queue should automaticlly flush
	 * when items are added to the queue.
	 */
	public setShouldAutoFlush(autoFlush: boolean) {
		this.shouldAutoFlush = autoFlush;
		return this;
	}

	/**
	 * Returns whether the queue is set to automatically flush.
	 */
	public getShouldAutoFlush() {
		return this.shouldAutoFlush;
	}

	/**
	 * Returns whether the queue is currently flushing.
	 */
	public isCurrentlyFlushing() {
		return this.isFlushing;
	}

	/**
	 * Calls the specified callback for each item in the queue.
	 */
	public forEach(callback: (item: T) => void) {
		this.items.forEach(callback);
		return this;
	}

	/**
	 * Clears the queue without invoking any flush.
	 * This simply clears the underlying array.
	 */
	public clear() {
		this.items.clear();
		return this;
	}

	/**
	 * Returns whether the queue is empty.
	 */
	public isEmpty() {
		return this.items.isEmpty();
	}

	/**
	 * Returns whether the queue is full.
	 */
	public isFull() {
		return this.maxItems !== undefined && this.size() >= this.maxItems;
	}

	/**
	 * Returns the number of items in the queue.
	 */
	public size() {
		return this.items.size();
	}
}
