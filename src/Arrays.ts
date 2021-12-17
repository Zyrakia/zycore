export namespace Arrays {
	export function pickRandom(value: any[], random = new Random()) {
		return value[random.NextNumber(0, value.size() - 1)];
	}

	export function shuffle(value: any[], random = new Random()) {
		const shuffled = value;

		for (let i = 0; i < shuffled.size(); i++) {
			const j = random.NextNumber(i, shuffled.size() - 1);
			const temp = shuffled[i];
			shuffled[i] = shuffled[j];
			shuffled[j] = temp;
		}

		return shuffled;
	}

	export function reverse(value: any[]) {
		const reversed = value;

		for (let i = 0; i < reversed.size() / 2; i++) {
			const j = reversed.size() - i - 1;
			const temp = reversed[i];
			reversed[i] = reversed[j];
			reversed[j] = temp;
		}

		return reversed;
	}
}
