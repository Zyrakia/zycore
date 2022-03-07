import { setTimeout, Timeout } from 'Interval';

import { Ping } from '@rbxts/ping';

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
	 * @param destructive Whether or not to start a new timeout after every push
	 */
	public constructor(private delay: number, private destructive = false) {}

	/**
	 * Pushes an update to the squasher.
	 *
	 * @param data The data to push.
	 */
	public push(data: T) {
		this.startDelay();
		this.runningData = data;
	}

	/**
	 * Starts a new publish delay if necessary.
	 */
	private startDelay() {
		if (this.destructive) this.stopDelay();
		if (this.currentTimeout) return;

		this.currentTimeout = setTimeout(() => this.publish(), this.delay);
	}

	/**
	 * Stops the current timeout.
	 */
	private stopDelay() {
		if (!this.currentTimeout) return;
		this.currentTimeout.destroy();
		this.currentTimeout = undefined;
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
		this.stopDelay();

		if (this.runningData === undefined) return;
		this.updatePing.fire(this.runningData);
		this.runningData = undefined;
	}

	/**
	 * Destroys this squasher and renders it unusable. This
	 * will destroy the current publish timeout, meaning any
	 * running data will be lost.
	 */
	public destroy() {
		this.updatePing.destroy();
		this.stopDelay();
		this.runningData = undefined;
	}
}
