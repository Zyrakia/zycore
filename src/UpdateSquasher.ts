import { Ping } from '@rbxts/ping';
import { setTimeout, Timeout } from 'Interval';

/**
 * A utility class that delays updates
 * by a certain amount of time and then
 * only sends the latest update.
 */
export class UpdateSquasher<T> {
	private updatePing = new Ping<[data: T]>();

	/** A ping that fires whenever the squasher pushes an update. */
	public readonly onUpdate = this.updatePing.connector;

	private currentTimeout?: Timeout;
	private runningData?: T;

	/**
	 * Creates a new UpdateSquasher.
	 *
	 * @param delay The delay in seconds to wait before sending an update
	 */
	public constructor(private delay: number) {}

	/**
	 * Pushes an update to the squasher.
	 *
	 * @param data The data to push.
	 */
	public push(data: T) {
		if (!this.currentTimeout) {
			this.currentTimeout = setTimeout(() => this.publish(), this.delay);
		}

		this.runningData = data;
	}

	/**
	 * Returns the current running date.
	 */
	public get() {
		return this.runningData;
	}

	/**
	 * Publishes the latest data and
	 * cancels then cancels the current timeout.
	 */
	public publish() {
		if (this.currentTimeout) {
			this.currentTimeout.destroy();
			this.currentTimeout = undefined;
		}

		if (!this.runningData) return;
		this.updatePing.fire(this.runningData);
		this.runningData = undefined;
	}
}
