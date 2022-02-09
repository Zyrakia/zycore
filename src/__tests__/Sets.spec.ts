import { Sets } from 'Sets';

export = () => {
	describe('pickRandom', () => {
		it('should pick a random item from the set', () => {
			const set = new Set<number>();
			for (let i = 0; i < 50; i++) set.add(i);

			const one = Sets.pickRandom(set);
			const two = Sets.pickRandom(set);
			const three = Sets.pickRandom(set);

			expect(one).to.never.equal(two);
			expect(two).to.never.equal(three);
			expect(three).to.never.equal(one);
		});
	});
};
