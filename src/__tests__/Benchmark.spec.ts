import { Benchmark } from 'Benchmark';

export = () => {
	describe('run', () => {
		const bench = Benchmark.run(() => {
			const a = 1;
			const b = 2;
			const c = 3;
			const d = 4;
			const e = 5;
			const f = 6;

			return a + b + c + d + e + f;
		}, 1000000);

		it('should have an accurate benchmark time', () => {
			expect(bench.getMicros()).to.be.near(26000, 2500);
		});
	});

	describe('runDebug', () => {
		it('should pass arguments properly', () => {
			Benchmark.runDebug('foo', (a: string) => expect(a).to.equal('foo'), 'foo');
		});

		it('should return the value of the function', () => {
			expect(Benchmark.runDebug('foo', () => 'foo')).to.equal('foo');
		});
	});
};
