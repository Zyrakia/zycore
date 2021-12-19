export namespace Benchmark {
	const RunService = game.GetService('RunService');

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

		const result = {
			print: (opName?: string) =>
				print(`Benchmark${opName ? `(${opName})` : ''}: ${elapsed}`),
			printIfClient: (opName?: string): void =>
				void (RunService.IsClient() && result.print(opName)),
			printIfServer: (opName?: string): void =>
				void (RunService.IsServer() && result.print(opName)),
			printIfStudio: (opName?: string): void =>
				void (RunService.IsStudio() && result.print(opName)),
			get: () => elapsed,
		};

		return result;
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
