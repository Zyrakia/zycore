export namespace Maps {
	/**
	 * Maps entries in a map into an array.
	 *
	 * @param map The map to map.
	 * @param cb The callback to call for each entry.
	 * @returns The mapped array.
	 */
	export function map<K, V, O>(map: Map<K, V>, cb: (key: K, value: V, index: number) => O): O[] {
		const out = [];

		let i = 0;
		for (const [key, value] of map) out.push(cb(key, value, i++));

		return out;
	}

	/**
	 * Picks a random entry from a map.
	 *
	 * @param map The map to pick from.
	 * @param random The random to use.
	 * @returns The random entry.
	 */
	export function pickRandom<K, V>(map: Map<K, V>, random = new Random()) {
		let i = random.NextNumber(0, map.size() - 1);
		for (const [key, value] of map) if (i-- <= 0) return [key, value] as const;
	}
}
