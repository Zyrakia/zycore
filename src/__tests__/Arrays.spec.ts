import { Arrays } from 'Arrays';

export = () => {
	describe('pickRandom', () => {
		it('should return a random element from the array', () => {
			const array = [1, 2, 3, 4, 5];
			const randomElement = Arrays.pickRandom(array);

			expect(array.includes(randomElement)).to.equal(true);
		});

		it('should return the same element with the same seed', () => {
			const array = [1, 2, 3, 4, 5];
			const random1 = new Random(0);
			const random2 = new Random(0);
			const randomElement1 = Arrays.pickRandom(array, random1);
			const randomElement2 = Arrays.pickRandom(array, random2);

			expect(randomElement1).to.equal(randomElement2);
		});

		it('should return a random element from the array with a different seed', () => {
			const array = [1, 2, 3, 4, 5];
			const random1 = new Random(1);
			const random2 = new Random(2);
			const randomElement1 = Arrays.pickRandom(array, random1);
			const randomElement2 = Arrays.pickRandom(array, random2);

			expect(randomElement1).to.never.equal(randomElement2);
		});
	});

	describe('equals', () => {
		it('should return true if the arrays are equal', () => {
			const array = [1, 2, 3, 4, 5];
			const array2 = [1, 2, 3, 4, 5];

			expect(Arrays.equals(array, array2)).to.equal(true);
		});

		it('should return false if the arrays are not equal', () => {
			const array = [1, 2, 3, 4, 5];
			const array2 = [1, 2, 3, 4, 6];

			expect(Arrays.equals(array, array2)).to.equal(false);
		});
	});

	describe('clone', () => {
		it('should return a copy of the array', () => {
			const array = [1, 2, 3, 4, 5];
			const clonedArray = Arrays.clone(array);

			expect(array).to.never.equal(clonedArray);
			expect(Arrays.equals(array, clonedArray)).to.equal(true);
		});
	});

	describe('shuffle', () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const shuffled = Arrays.shuffle(arr);

		it('should shuffle an input array', () => {
			expect(Arrays.equals(arr, shuffled)).to.equal(false);
			expect(shuffled.size()).to.equal(arr.size());
		});

		it('should not modify the original array', () => {
			expect(Arrays.equals(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).to.equal(true);
		});

		it('should have the same result with the same seed', () => {
			const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

			const shuffled1 = Arrays.shuffle(arr, new Random(0));
			const shuffled2 = Arrays.shuffle(arr, new Random(0));

			expect(Arrays.equals(shuffled1, shuffled2)).to.equal(true);
		});

		it('should have different result with different seed', () => {
			const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

			const shuffled1 = Arrays.shuffle(arr, new Random(0));
			const shuffled2 = Arrays.shuffle(arr, new Random(1));

			expect(Arrays.equals(shuffled1, shuffled2)).to.equal(false);
		});
	});

	describe('reverse', () => {
		const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
		const reversed = Arrays.reverse(arr);

		it('should reverse an input array', () => {
			expect(Arrays.equals(reversed, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1])).to.equal(true);
		});

		it('should not modify the original array', () => {
			expect(Arrays.equals(arr, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10])).to.equal(true);
		});
	});
};
