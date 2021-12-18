import { Arrays } from 'Arrays';
import { Numbers } from 'Numbers';

export = () => {
	describe('spread', () => {
		it('should return a list of numbers between from and to (inclusive)', () => {
			expect(Arrays.equals(Numbers.spread(1, 3), [1, 2, 3])).to.equal(true);
			expect(Arrays.equals(Numbers.spread(1, 2), [1, 2])).to.equal(true);
			expect(Arrays.equals(Numbers.spread(1, 1), [1])).to.equal(true);
			expect(Arrays.equals(Numbers.spread(1, 0), [])).to.equal(true);
		});
	});

	describe('sequence', () => {
		it('should return the given list of numbers evenly spread out into a NumberSequence', () => {
			const generated = Numbers.sequence(1, 2, 3);

			const manual = new NumberSequence([
				new NumberSequenceKeypoint(0, 1),
				new NumberSequenceKeypoint(0.5, 2),
				new NumberSequenceKeypoint(1, 3),
			]);

			generated.Keypoints.forEach((v, i) => {
				expect(v.Value).to.equal(manual.Keypoints[i].Value);
				expect(v.Time).to.equal(manual.Keypoints[i].Time);
			});
		});
	});

	describe('isInteger', () => {
		it('should return whether the given number is an integer', () => {
			expect(Numbers.isInteger(1)).to.equal(true);
			expect(Numbers.isInteger(2)).to.equal(true);
			expect(Numbers.isInteger(0)).to.equal(true);
			expect(Numbers.isInteger(-1)).to.equal(true);
			expect(Numbers.isInteger(-2)).to.equal(true);
			expect(Numbers.isInteger(0.5)).to.equal(false);
			expect(Numbers.isInteger(-0.5)).to.equal(false);
		});
	});

	describe('isEven', () => {
		it('should return whether the given number is even', () => {
			expect(Numbers.isEven(1)).to.equal(false);
			expect(Numbers.isEven(2)).to.equal(true);
			expect(Numbers.isEven(0)).to.equal(true);
			expect(Numbers.isEven(-1)).to.equal(false);
			expect(Numbers.isEven(-2)).to.equal(true);
			expect(Numbers.isEven(0.5)).to.equal(false);
			expect(Numbers.isEven(-0.5)).to.equal(false);
		});
	});

	describe('isOdd', () => {
		it('should return whether the given number is odd', () => {
			expect(Numbers.isOdd(1)).to.equal(true);
			expect(Numbers.isOdd(2)).to.equal(false);
			expect(Numbers.isOdd(0)).to.equal(false);
			expect(Numbers.isOdd(-1)).to.equal(true);
			expect(Numbers.isOdd(-2)).to.equal(false);
			expect(Numbers.isOdd(0.5)).to.equal(false);
			expect(Numbers.isOdd(-0.5)).to.equal(false);
		});
	});

	describe('truncate', () => {
		it('should return the given number truncated to the given number of decimal places', () => {
			expect(Numbers.truncate(1.2345, 2)).to.equal(1.23);
			expect(Numbers.truncate(1.2355, 2)).to.equal(1.23);
			expect(Numbers.truncate(1.2345, 0)).to.equal(1);
			expect(Numbers.truncate(1.2345, 4)).to.equal(1.2345);
			expect(Numbers.truncate(1.2345, 5)).to.equal(1.2345);
		});
	});

	describe('randomOffset', () => {
		it('should return a random offset between -1 and 1', () => {
			const randomOffset = Numbers.randomOffset(1);
			expect(randomOffset >= -1 && randomOffset <= 1).to.equal(true);
		});

		it('should accept negative numbers and act the same', () => {
			const randomOffset = Numbers.randomOffset(-1);
			expect(randomOffset >= -1 && randomOffset <= 1).to.equal(true);
		});
	});

	describe('suid', () => {
		it('should return a unique id', () => {
			const id1 = Numbers.SUID();
			const id2 = Numbers.SUID();
			expect(id1).to.never.equal(id2);
		});
	});
};
