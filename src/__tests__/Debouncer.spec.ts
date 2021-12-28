import { Debouncer } from 'debouncer/Debouncer';
import { DebouncerMap } from 'debouncer/DebouncerMap';

export = () => {
	describe('debouncer', () => {
		it('should debounce', () => {
			const debouncer = new Debouncer(0.1);
			let count = 0;

			for (let i = 0; i < 10; i++) {
				if (debouncer.try()) count++;
			}

			expect(count).to.equal(1);
		});

		it('should lock/unlock', () => {
			const debouncer = new Debouncer(0.1);
			debouncer.lock();
			expect(debouncer.check()).to.equal(false);
			debouncer.unlock();
			expect(debouncer.check()).to.equal(true);
		});

		it('should reset', () => {
			const debouncer = new Debouncer(0.1);
			expect(debouncer.try()).to.equal(true);
			expect(debouncer.try()).to.equal(false);
			debouncer.reset();
			expect(debouncer.try()).to.equal(true);
		});
	});

	describe('debouncerMap', () => {
		it('should debounce', () => {
			const map = new DebouncerMap<string>(0.1);
			let count = 0;

			for (let i = 0; i < 10; i++) {
				if (map.try('test')) count++;
			}

			expect(count).to.equal(1);
		});
	});
};
