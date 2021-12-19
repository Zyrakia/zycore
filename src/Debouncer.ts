import { Workspace } from "@rbxts/services";

export class Debouncer {
	private last?: number;
	private locked = false;

	/**
	 * Creates a new debouncer.
	 *
	 * @param timeout The timeout in seconds.
	 */
	public constructor(private timeout: number) {}

	/**
	 * Tries to pass the debouncer.
	 * This will set the last time to the current time if it passes.
	 *
	 * @returns Whether the debouncer passed.
	 */
	public try() {
		const canPass = this.check();
		if (canPass) this.last = Workspace.GetServerTimeNow();
		return canPass;
	}

	/**
	 * Checks whether the debouncer can pass.
	 * This will NOT set the last time to the current time.
	 *
	 * @returns Whether the debouncer can pass.
	 */
	public check() {
		if (this.locked) return false;
		if (this.last === undefined) return true;

		const now = Workspace.GetServerTimeNow();
		if (now - this.last >= this.timeout) return true;

		return false;
	}

	/**
	 * Locks the debouncer.
	 * This will prevent the debouncer from passing.
	 */
	public lock() {
		this.locked = true;
	}

	/**
	 * Unlocks the debouncer.
	 * This will allow the debouncer to pass.
	 */
	public unlock() {
		this.locked = false;
	}

	/**
	 * Returns whether the debouncer is locked.
	 */
	public isLocked() {
		return this.locked;
	}

	/**
	 * Sets the timeout of the debouncer.
	 *
	 * @param timeout The timeout in seconds.
	 */
	public setTimeout(timeout: number) {
		this.timeout = timeout;
	}

    /**
     * Resets the debouncer.
     */
    public reset() {
        this.last = undefined;
    }

	/**
	 * Returns the timeout of the debouncer.
	 */
	public getTimeout() {
		return this.timeout;
	}

	/**
	 * Returns the last time the debouncer was passed.
	 */
	public getLast() {
		return this.last;
	}
}
