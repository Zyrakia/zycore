import { Arrays } from 'Arrays';
import { Objects } from 'Objects';

export = () => {
	describe('capitalizeKeys', () => {
		it('should capitalize all keys within the input object', () => {
			const input = { ab: 1, b: 2, c: 3, d: { a: 1, b: 2 } };
			const output = Objects.capitalizeKeys(input);
			expect(output.Ab).to.equal(1);
			expect(output.B).to.equal(2);
			expect(output.C).to.equal(3);
			expect(output.D.A).to.equal(1);
			expect(output.D.B).to.equal(2);
		});
	});

	describe('uncapitalizeKeys', () => {
		it('should uncapitalize all keys within the input object', () => {
			const input = { AB: 1, B: 2, C: 3, D: { A: 1, B: 2 } };
			const output = Objects.uncapitalizeKeys(input);
			expect(output.aB).to.equal(1);
			expect(output.b).to.equal(2);
			expect(output.c).to.equal(3);
			expect(output.d.a).to.equal(1);
			expect(output.d.b).to.equal(2);
		});
	});

	describe('getChangedKeys', () => {
		it('should return an array of changed keys', () => {
			const objectOne = { a: 1, b: 2, c: 3, d: 4 };
			const objectTwo = { b: 1, c: 3, d: 5 };
			const changedKeys = Objects.getChangedKeys(objectOne, objectTwo);
			expect(Arrays.fuzzyEquals(changedKeys, ['a', 'b', 'd'])).to.equal(true);
		});

		it('should return an empty array if the objects are the same', () => {
			const objectOne = { a: 1, b: 2, c: 3, d: 4 };
			const objectTwo = { a: 1, b: 2, c: 3, d: 4 };
			const changedKeys = Objects.getChangedKeys(objectOne, objectTwo);
			expect(changedKeys.isEmpty()).to.equal(true);
		});
	});
};
