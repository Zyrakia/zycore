import { RunService } from '@rbxts/services';

class BenchmarkResult {
	public constructor(private elapsed: number) {}

	/**
	 * Writes the benchmark result to the console in the format:
	 * Benchmark({opName}?): {elapsedTime}
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public write(opName?: string) {
		print(`Benchmark${opName ? `(${opName})` : ''}: ${this.elapsed}`);
	}

	/**
	 * Writes if running as client.
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public writeIfClient(opName?: string) {
		if (RunService.IsClient()) this.write(opName);
	}

	/**
	 * Writes if running as server.
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public writeIfServer(opName?: string) {
		if (RunService.IsServer()) this.write(opName);
	}

	/**
	 * Writes if running in studio.
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public writeIfStudio(opName?: string) {
		if (RunService.IsStudio()) this.write(opName);
	}

	/**
	 * Writes only if the specific condition is true.
	 *
	 * @param condition The condition to check.
	 * @param opName The name of the operation being benchmarked.
	 */
	public writeIf(condition: boolean, opName?: string) {
		if (condition) this.write(opName);
	}

	/**
	 * Returns the elapsed time of the benchmark.
	 */
	public getTime() {
		return this.elapsed;
	}
}

export namespace Benchmark {
	/**
	 * Runs a benchmark and returns a few utility functions to use the elapsed time.
	 *
	 * @param f The function to benchmark.
	 * @param args The arguments to pass to the function.
	 *
	 * @returns an object containing functions to use the elapsed time.
	 */
	export function run<A extends defined[]>(f: (...args: A) => void, ...args: A) {
		const now = os.clock();
		f(...args);
		const elapsed = os.clock() - now;

		return new BenchmarkResult(elapsed);
	}

	/**
	 * Starts a profile with the specified name, runs the function, and ends the profile.
	 *
	 * @param opName The name of the profile.
	 * @param f The function to profile.
	 * @param args The arguments to pass to the function.
	 *
	 * @returns The return value of the function.
	 */
	export function runDebug<A extends defined[], R>(
		opName: string,
		f: (...args: A) => R,
		...args: A
	) {
		debug.profilebegin(opName);
		const result = f(...args);
		debug.profileend();

		return result;
	}
}
