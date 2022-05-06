import { setTimeout, Timeout } from 'Interval';

/**
 * A class that holds a value for a certain amount of time and clears it when it expires.
 * When the value is requested, if it is not in the cache, it is fetched from the getter.
 */
export class CacheValue<K> {
	/** The current cached value. */
	private value?: K;

	/** The active forget timeout of the value. */
	private timeout?: Timeout;

	/**
	 * Creates a new cache value.
	 *
	 * @param getter The getter used to fetch the value if it's not cached.
	 * @param expirationSeconds The number of seconds to cache the value for, or omit to cache forever.
	 * @param invalidator The function to call with every get to check if the value is still valid.
	 */
	public constructor(
		private getter: () => K,
		private expirationSeconds?: number,
		private invalidator?: (currentValue: K) => boolean,
	) {}

	/**
	 * Returns the cached value, or fetches it if it's not cached.
	 *
	 * @returns The cached value.
	 */
	public get() {
		if (this.isValid()) return this.value as K;
		else return this.fetch();
	}

	/**
	 * Forces a specific value to be cached.
	 * Unless forgettable is false, this will start a new forget timeout.
	 * If it is false, any existing forget timeout will be stopped, and
	 * no new one will be started.
	 *
	 * @param value The value to cache.
	 * @param forgettable Whether a forget timeout should be started for the value. Defaults to true.
	 */
	public set(value: K, forgettable = true) {
		this.value = value;
		if (forgettable) this.startForgetting();
		else this.stopForgetting();
	}

	/**
	 * Forces the cache to forget the value and stop
	 * the existing forget timeout, if any.
	 */
	public forget() {
		this.stopForgetting();
		this.value = undefined;
	}

	/**
	 * Fetches and sets the value from the getter and
	 * starts a forget timeout if necessary.
	 *
	 * @returns The fetched value.
	 */
	private fetch() {
		const value = this.getter();
		this.value = value;
		this.startForgetting();
		return value;
	}

	/**
	 * Returns whether the current value is still
	 * valid.
	 *
	 * @returns Whether the value is still valid.
	 */
	private isValid() {
		if (this.value === undefined) return false;
		return !!this.invalidator && this.invalidator(this.value);
	}

	/**
	 * Starts a forget timeout if necessary.
	 * If a forget timeout is already running, it will be stopped.
	 */
	private startForgetting() {
		if (this.expirationSeconds === undefined) return;
		this.stopForgetting();

		this.timeout = setTimeout(() => {
			this.forget();
		}, this.expirationSeconds);
	}

	/**
	 * Stops the forget timeout if it is running.
	 */
	private stopForgetting() {
		if (!this.timeout) return;
		this.timeout.destroy();
		this.timeout = undefined;
	}

	/**
	 * Sets the expiration seconds for the cache value.
	 * If it is set to nothing, the active forget timeout
	 * will be stopped, and the value will never expire.
	 *
	 * If it is set to a number, it will not start a new
	 * forget timeout, and only kick into effect if the
	 * value is fetched again.
	 */
	public setExpirationSeconds(seconds: number) {
		this.expirationSeconds = seconds;
		if (seconds === undefined) this.stopForgetting();
	}
}
