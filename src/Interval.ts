export type Interval = {
	/** Cancels the interval, preventing any further executions. */
	destroy: () => void;

	/** Returns whether the interval has been destroyed. */
	isDestroyed: () => boolean;

	/** Adjusts the interval, applies the next iteration. */
	adjustInterval: (interval: number) => void;
};

export type Timeout = {
	/** If a timeout has not executed yet, this will prevent it from executing. */
	destroy: () => void;

	/** Returns whether the Timeout has been destroyed. */
	isDestroyed: () => boolean;

	/** Returns whether the Timeout has executed. */
	hasExecuted: () => boolean;
};

/**
 * Creates an interval that runs the function every `interval` seconds.
 * Note that the first run will happen after `interval` seconds, if this
 * behavior is desired, use `setIntervalNow` instead.
 *
 * While a new thread is started for the initial interval loop, one is
 * not started for each iteration, meaning the actual delay between
 * iterations is `interval` seconds, plus any time the function
 * takes to execute, including any yielding that occurs within it.
 *
 * @param cb The function to run.
 * @param interval The interval in seconds.
 * @param args The arguments to pass to the function.
 * @returns The interval.
 */
export function setInterval<A extends unknown[]>(
	cb: (...args: A) => void,
	interval?: number,
	...args: A
): Interval {
	let timeout = interval;
	let running = true;

	task.spawn(() => {
		while (running) {
			task.wait(timeout);
			if (running) cb(...args);
		}
	});

	return {
		destroy: () => (running = false),
		isDestroyed: () => !running,
		adjustInterval: (interval?: number) => (timeout = interval),
	};
}

/**
 * Asynchronously calls the specified function immediately and
 * then calls {@link setInterval} with the specified parameters.
 *
 * @param cb The function to run.
 * @param interval The interval in seconds.
 * @param args The arguments to pass to the function.
 * @returns The interval.
 */
export function setIntervalNow<A extends unknown[]>(
	cb: (...args: A) => void,
	interval?: number,
	...args: A
): Interval {
	task.spawn(() => cb(...args));
	return setInterval(cb, interval, ...args);
}

/**
 * Creates a timeout that runs the function after `timeout` seconds.
 *
 * @param cb The function to run.
 * @param timeout The timeout in seconds.
 * @param args The arguments to pass to the function.
 * @returns The timeout.
 */
export function setTimeout<A extends unknown[]>(
	cb: (...args: A) => void,
	timeout: number,
	...args: A
): Timeout {
	let shouldRun = true;
	let didRun = false;

	task.spawn(() => {
		task.wait(timeout);
		if (shouldRun) {
			cb(...args);
			didRun = true;
		}
	});

	return {
		destroy: () => (shouldRun = false),
		isDestroyed: () => !shouldRun,
		hasExecuted: () => didRun,
	};
}
