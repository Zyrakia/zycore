import { BinMap } from 'BinMap';

export = () => {
	describe('add', () => {
		it('should be able to add an item to any bin', () => {
			const map = new BinMap<string>();
			expect(map.isEmpty('a')).to.equal(true);
			map.add('a', () => {});
			expect(map.isEmpty('a')).to.equal(false);
		});

		it('should be able to destroy any bin', () => {
			const map = new BinMap<string>();
			let called = false;
			map.add('a', () => (called = true));
			map.destroy('a');
			expect(called).to.equal(true);
		});

		it('should be able to destroy all bins', () => {
			const map = new BinMap<string>();
			let called = 0;

			map.add('a', () => (called += 1));
			map.add('b', () => (called += 1));
			map.add('c', () => (called += 1));

			map.destroyAll();
			expect(called).to.equal(3);
		});

		it('should be able to delete any bin', () => {
			const map = new BinMap<string>();
			let called = false;
			map.add('a', () => (called = true));
			map.delete('a');
			expect(called).to.equal(true);
		});

		it('should be able to delete all bins', () => {
			const map = new BinMap<string>();
			let called = 0;

			map.add('a', () => (called += 1));
			map.add('b', () => (called += 1));
			map.add('c', () => (called += 1));

			map.deleteAll();
			expect(called).to.equal(3);
		});
	});
};
