import { Benchmark } from 'Benchmark';

export = () => {
	describe('run', () => {
		const bench = Benchmark.run(() => {
			task.wait(0.1);
		});

		it('should have an accurate benchmark time', () => {
			expect(bench.get()).to.be.near(0.1, 0.025);
		});

		it('should pass arguments properly', () => {
			Benchmark.run((a: string) => {
				expect(a).to.equal('foo');
			}, 'foo');
		});
	});

	describe('runDebug', () => {
		it('should pass arguments properly', () => {
			Benchmark.runDebug(
				'foo',
				(a: string) => {
					expect(a).to.equal('foo');
				},
				'foo',
			);
		});

		it('should return the value of the function', () => {
			expect(Benchmark.runDebug('foo', () => 'foo')).to.equal('foo');
		});
	});
};
