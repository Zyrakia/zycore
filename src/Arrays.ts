export namespace Arrays {
	export function pickRandom<T extends defined[]>(value: T, random = new Random()): T[number] {
		return value[random.NextInteger(0, value.size() - 1)];
	}

	export function equals(value: defined[], value2: defined[]) {
		return value.every((v, i) => v === value2[i]);
	}

	export function clone<T extends defined[]>(value: T) {
		return [...value];
	}

	export function shuffle<T extends defined[]>(value: T, random = new Random()) {
		const shuffled = clone(value);

		for (let i = 0; i < shuffled.size(); i++) {
			const j = random.NextInteger(i, shuffled.size() - 1);
			const temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}

		return shuffled;
	}

	export function reverse<T extends defined[]>(value: T) {
		const reversed = clone(value);

		for (let i = 0; i < reversed.size() / 2; i++) {
			const j = reversed.size() - i - 1;
			const temp = reversed[i];
			reversed[i] = reversed[j];
			reversed[j] = temp;
		}

		return reversed;
	}
}
