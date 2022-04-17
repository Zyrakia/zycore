export namespace Maps {
	export function map<K, V, O>(map: Map<K, V>, cb: (key: K, value: V, index: number) => O): O[] {
		const out = [];

		let i = 0;
		for (const [key, value] of map) out.push(cb(key, value, i++));

		return out;
	}
}
