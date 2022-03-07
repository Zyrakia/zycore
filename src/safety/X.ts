import { CleanableValue, cleanup } from './Cleanup';

type Node = { next?: Node; item: CleanableValue };

/** A utility class used to track and later clean up multiple values. */
export class X {
	private head?: Node;
	private tail?: Node;

	/**
	 * Adds an item to be cleanuped up when this X is destroyed.
	 *
	 * @param item The item to cleanup.
	 * @returns The item.
	 */
	public x<T extends CleanableValue>(item: T): T {
		const node: Node = { item };
		this.head ??= node;

		if (this.tail) this.tail.next = node;
		this.tail = node;

		return item;
	}

	/**
	 * Destroys all items in this X.
	 */
	public destroy() {
		while (this.head) {
			const { item, next: nextNode } = this.head;
			cleanup(item);
			this.head = nextNode;
		}
	}

	/**
	 * Returns the amount of items in this X.
	 */
	public size() {
		let count = 0;
		let node = this.head;

		while (node) {
			count++;
			node = node.next;
		}

		return count;
	}

	/**
	 * Returns whether the X is empty.
	 */
	public isEmpty() {
		return this.head === undefined;
	}
}
