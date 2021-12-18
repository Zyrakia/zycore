export type Interval = {
	destroy: () => void;
};

export type Timeout = {
	destroy: () => void;
};

/**
 * Creates an interval that runs the function every `interval` seconds.
 *
 * @param cb The function to run.
 * @param interval The interval in seconds.
 * @param args The arguments to pass to the function.
 * @returns The interval.
 */
export function setInterval<A extends unknown[]>(
	cb: (...args: A) => void,
	interval: number,
	...args: A
): Interval {
	let running = true;

	task.spawn(() => {
		while (running) {
			task.wait(math.abs(interval));
			if (running) cb(...args);
		}
	});

	return { destroy: () => (running = false) };
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
	interval: number,
	...args: A
): Timeout {
	let shouldRun = true;

	task.spawn(() => {
		task.wait(math.abs(interval));
		if (shouldRun) cb(...args);
	});

	return { destroy: () => (shouldRun = false) };
}
