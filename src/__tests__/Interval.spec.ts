import { setInterval, setTimeout } from 'Interval';

export = () => {
	describe('setInterval', () => {
		it('should run the function every interval seconds', () => {
			let count = 0;

			const interval = setInterval(() => {
				count++;
			}, 0.5);
			task.wait(0.5);
			expect(count).to.equal(1);

			task.wait(0.5);
			expect(count).to.equal(2);

			task.wait(0.5);
			expect(count).to.equal(3);

			interval.destroy();
		});
	});

	describe('setTimeout', () => {
		it('should run the function after timeout seconds', () => {
			let count = 0;

			const timeout = setTimeout(() => {
				count++;
			}, 0.1);

			task.wait(0.2);
			timeout.destroy();

			expect(count).to.equal(1);
		});
	});
};
