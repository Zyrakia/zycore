import { RunService } from '@rbxts/services';

class BenchmarkResult {
	public constructor(
		private elapsed: number,
		private runCount: number,
		private opName?: string,
	) {}

	/**
	 * Writes the benchmark result to the console, if multiple runs
	 * were performed it will show the average time and then in brackets
	 * the total time, otherwise it will just show the total time.
	 *
	 * If the operation took more than 1000 microseconds, it will
	 * show the time in milliseconds, if the operation took more than
	 * 1000 milliseconds, it will show the time in seconds. Otherwise
	 * it will show the time in microseconds.
	 *
	 * Format:
	 * `Benchmark({opName}?): {runTime} μs/ms/s * ${runCount} ({totalTime?} μs/ms/s)`
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public write(opName = this.opName) {
		print(
			`${this.formatName(opName)} ${
				this.runCount > 1
					? `${this.formatPerRun()} (${this.formatTotalRun()})`
					: `${this.formatTotalRun()}`
			}`,
		);
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
	 * Returns the elapsed time of the benchmark in seconds.
	 */
	public getSeconds() {
		return this.elapsed;
	}

	/**
	 * Returns the average time in seconds.
	 */
	public getSecondsPerRun() {
		return this.elapsed / this.runCount;
	}

	/**
	 * Returns the elapsed time of the benchmark in milliseconds.
	 */
	public getMillis() {
		return this.elapsed * 1000;
	}

	/**
	 * Returns the average time in milliseconds.
	 */
	public getMillisPerRun() {
		return this.getMillis() / this.runCount;
	}

	/**
	 * Returns the elapsed time of the benchmark in microseconds.
	 */
	public getMicros() {
		return this.elapsed * 1000000;
	}

	/**
	 * Returns the average time in microseconds.
	 */
	public getMicrosPerRun() {
		return this.getMicros() / this.runCount;
	}

	/**
	 * Formats the total run time of the benchmark with
	 * the appropriate unit.
	 */
	private formatTotalRun() {
		const micros = this.getMicros();
		const millis = this.getMillis();
		const seconds = this.getSeconds();

		if (micros <= 1000) return '%.2f μs'.format(micros);
		else if (millis <= 1000) return '%.2f ms'.format(millis);
		else return '%.2f s'.format(seconds);
	}

	/**
	 * Formats the average time of the benchmark with
	 * the appropriate unit.
	 */
	private formatPerRun() {
		const micros = this.getMicrosPerRun();
		const millis = this.getMillisPerRun();
		const seconds = this.getSecondsPerRun();

		if (micros <= 1000) return `%.2f μs * ${this.runCount}`.format(micros);
		else if (millis <= 1000) return `%.2f ms * ${this.runCount}`.format(millis);
		else return `%.2f s * ${this.runCount}`.format(seconds);
	}

	/**
	 * Formats the name of the benchmark depending
	 * on if an operation name was provided.
	 */
	private formatName(opName?: string) {
		return `Benchmark${opName ? `(${opName})` : ''}:`;
	}
}

export namespace Benchmark {
	const activeBenchmarks = new Map<string, number>();

	/**
	 * Runs a benchmark and returns a few utility functions to use the elapsed time.
	 *
	 * @param f The function to benchmark.
	 * @param runCount The number of times to run the function. Will be rounded and at least 1.
	 *
	 * @returns an object containing functions to use the elapsed time.
	 */
	export function run(f: () => void, runCount = 1) {
		const runs = math.round(math.max(runCount, 1));

		const start = os.clock();
		for (let i = 0; i < runs; i++) f();
		const fin = os.clock();

		return new BenchmarkResult(fin - start, runs);
	}

	/**
	 * Starts a benchmark with the specified ID.
	 * If a benchmark with the same ID is already running, this will throw.
	 *
	 * This benchmark can be stopped with {@link stop}, which
	 * will return the benchmark result of time time between
	 * the two calls.
	 *
	 * @param id The ID of the benchmark.
	 */
	export function start(id: string) {
		if (activeBenchmarks.has(id)) throw `Benchmark with id(${id}) already started.`;
		activeBenchmarks.set(id, os.clock());
	}

	/**
	 * Used to stop a benchmark with the specified ID.
	 * If no benchmark with the ID exists, this will throw.
	 *
	 * This will return the benchmark result of the time between
	 * the two calls. If the opName in any of the write functions
	 * is omitted, the ID of the benchmark will automatically be
	 * used.
	 *
	 * @param id The ID of the benchmark.
	 * @returns The benchmark result.
	 */
	export function stop(id: string) {
		if (!activeBenchmarks.has(id)) throw `Benchmark with id(${id}) not started.`;
		const start = activeBenchmarks.get(id)!;
		const fin = os.clock();

		activeBenchmarks.delete(id);

		return new BenchmarkResult(fin - start, 1, id);
	}

	/**
	 * Starts a profile with the specified name, runs the function, and ends the profile.
	 *
	 * @param opName The name of the profile.
	 * @param f The function to profile.
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
