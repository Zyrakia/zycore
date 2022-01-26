import { RunService } from '@rbxts/services';
import { Time, TimeUnit } from 'Time';

class BenchmarkResult {
	public constructor(
		private elapsed: number,
		private runCount: number,
		private opName?: string,
	) {}

	/**
	 * Returns the result of the benchmark in
	 * a readable and consistent format. Depending on
	 * how long the benchmark took, it will show different
	 * units. If the benchmark was run multiple times it will
	 * show the total time and the average time, with the amount
	 * of runs that were performed.
	 *
	 * Format:
	 * `Benchmark({opName}?): {runTime} μs/ms/s ({totalTime?} μs/ms/s for {runCount} runs)`
	 *
	 * @param opName The name of the operation being benchmarked.
	 * @returns The benchmark result in a readable format.
	 */
	public getMessage(opName = this.opName) {
		return `${this.formatName(opName)} ${
			this.runCount > 1
				? `${this.formatPerRun()} (${this.formatTotalRun()} for ${this.runCount} runs)`
				: `${this.formatTotalRun()}`
		}`;
	}

	/**
	 * Writes the benchmark result to the console, in a readable
	 * and consistent format. This just prints the result of
	 * {@link getMessage} to the console.
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public write(opName?: string) {
		print(this.getMessage(opName));
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
		return Time.convert(this.elapsed, TimeUnit.SECOND, TimeUnit.MILLI);
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
		return Time.convert(this.elapsed, TimeUnit.SECOND, TimeUnit.MICRO);
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

		if (micros <= 1000) return `%.2f μs`.format(micros);
		else if (millis <= 1000) return `%.2f ms`.format(millis);
		else return `%.2f s`.format(seconds);
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

		return new BenchmarkResult(Time.diff(start, fin), runs);
	}

	/**
	 * Runs a function and returns the result of the function. In addition to returning
	 * the result, it also writes the benchmark result to the console automatically.
	 *
	 * @param f The function to benchmark.
	 * @param opName The name of the operation being benchmarked.
	 */
	export function runReturn(f: () => void, opName?: string) {
		const result = run(f);
		result.write(opName);
		return result;
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

		return new BenchmarkResult(Time.diff(start, fin), 1, id);
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
