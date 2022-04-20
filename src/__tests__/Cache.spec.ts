import { Cache } from 'cache/Cache';

export = () => {
	describe('wrap', () => {
		let called = 0;
		function test(_: number) {
			called++;
		}

		const cacheTest = Cache.wrap(test);

		for (let i = 1; i < 50; i++) {
			cacheTest(i);
			expect(called).to.equal(i);

			cacheTest(i);
			expect(called).to.equal(i);
		}
	});
};
