import { logErrorNonFatal } from 'Log';

/**
 * A utility class that can be used
 * to retry an arbitrary operation.
 */
export class Retrier {
	/** The amount of attempts that have been executed. */
	private attempts = 0;

	/**
	 * Constructs a new Retrier.
	 *
	 * @param maxAtttempts The maximum number of attempts to make. Defaults to 5.
	 * @param attemptDelay The delay between attempts. Defaults to 0.
	 * @param onFailureStep A callback that is called after each failed attempt.
	 */
	public constructor(
		private maxAtttempts = 5,
		private attemptDelay = 0,
		private onFailureStep?: (attempts: number, error: unknown) => void,
	) {}

	/**
	 * Retires the given operation until it succeeds or the maximum number of
	 * attempts is reached. This will reset the number of attempts before
	 * starting any attempts.
	 *
	 * @param op The operation to retry.
	 * @param opName The name of the operation, used for logging.
	 * @returns Whether the operation succeeded.
	 */
	public retry(op: () => void, opName?: string) {
		this.reset();

		while (this.attempts < this.maxAtttempts) {
			this.attempts++;

			try {
				op();
				return true;
			} catch (err) {
				const shouldTerminate = this.handleFailure(err, opName);
				if (!shouldTerminate) {
					task.wait(this.attemptDelay);
					continue;
				}

				return false;
			}
		}

		return false;
	}

	/**
	 * Announces the failure of the operation and logs an error
	 * if the maximum number of attempts have been reached.
	 *
	 * @param err The error that caused the failure.
	 * @param opName The name of the operation, used for logging.
	 * @returns Whether the maximum number of attempts has been reached.
	 */
	private handleFailure(err: unknown, opName?: string) {
		this.onFailureStep?.(this.attempts, err);
		if (this.attempts < this.maxAtttempts) return false;

		logErrorNonFatal(
			`Failed to execute ${opName ? `"${opName}"` : 'operation'} after ${
				this.attempts
			} attempts. Error from operation:\n${err}`,
		);

		return true;
	}

	/**
	 * Resets the number of attempts to 0.
	 */
	private reset() {
		this.attempts = 0;
	}
}
