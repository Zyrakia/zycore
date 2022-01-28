import { Retrier } from 'safety/Retrier';

export = () => {
	it('should properly run an operation if no error is thrown', () => {
		const retrier = new Retrier();

		let called = false;
		function operation() {
			called = true;
		}

		expect(retrier.retry(operation)).to.equal(true);
		expect(called).to.equal(true);
	});

	it('should properly run an operation if an error is thrown', () => {
		const retrier = new Retrier();

		let called = 0;
		function operation() {
			called++;
			throw 'An intentional test error from the Retrier test.';
		}

		expect(retrier.retry(operation)).to.equal(false);
		expect(called).to.equal(5);
	});
};
