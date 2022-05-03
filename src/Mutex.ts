/**
 * A utility class for managing access to a resource
 * that is shared among multiple threads.
 */
export class Mutex {
	/** The queue of threads waiting to acquire the mutex. */
	private queue: thread[] = [];

	/**
	 * Acquires this mutex, any subsequent calls to this method
	 * will yield until the mutex is released.
	 */
	public acquire() {
		const thread = coroutine.running();
		this.queue.push(thread);

		if (this.queue.size() !== 1) coroutine.yield();
	}

	/**
	 * Releases this mutex. If another thread is waiting to acquire the mutex,
	 * it will be resumed. This method `does not` throw if the mutex is not
	 * acquired.
	 */
	public release() {
		this.queue.shift();

		if (!this.queue.isEmpty()) coroutine.resume(this.queue[0]);
	}

	/**
	 * Acquires this mutex and unlocks it when the given function
	 * completes execution either normally or by throwing an exception.
	 *
	 * @param fn The function to execute.
	 * @param args The arguments to pass to the function.
	 * @returns The return value of the function.
	 */
	public run<T, A extends any[]>(fn: (...args: A) => T, ...args: A) {
		this.acquire();

		try {
			return fn(...args);
		} finally {
			this.release();
		}
	}

	/**
	 * Wraps a function so that it automatically acquires and releases
	 * the mutex.
	 *
	 * @param fn The function to wrap.
	 * @returns A function that acquires and releases the mutex.
	 */
	public wrap<T, A extends any[]>(fn: (...args: A) => T) {
		return (...args: A) => this.run(fn, ...args);
	}
}
