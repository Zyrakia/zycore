import { RunService } from '@rbxts/services';

class BenchmarkResult {
	private micros: number;
	private microsPerRun: number;

	public constructor(elapsed: number, private runCount: number, private opName?: string) {
		this.micros = elapsed * 1000000;
		this.microsPerRun = this.micros / runCount;
	}

	/**
	 * Writes the average time of the operation in micros to the
	 * console, followed with the total time in micros if the
	 * operation was ran multiple times.
	 *
	 * Format:
	 * Benchmark({opName}?): {runMicros} μs ({totalMicros?} μs total)
	 *
	 * @param opName The name of the operation being benchmarked.
	 */
	public write(opName = this.opName) {
		print(
			`Benchmark${opName ? `(${opName})` : ''}: ${this.formatMicros(this.microsPerRun)}${
				this.runCount > 1 ? ` (${this.formatMicros(this.micros)})` : ''
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
	 * Returns the elapsed time of the benchmark.
	 */
	public getMicros() {
		return this.micros;
	}

	/**
	 * Returns the average time in micros.
	 */
	public getMicrosPerRun() {
		return this.microsPerRun;
	}

	private formatMicros(micros: number) {
		return '%.2f μs'.format(micros);
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
