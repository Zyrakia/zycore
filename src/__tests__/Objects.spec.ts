import { Objects } from 'Objects';

export = () => {
	describe('capitalizeKeys', () => {
		it('should capitalize all keys within the input object', () => {
			const input = { a: 1, b: 2, c: 3, d: { a: 1, b: 2 } };
			const output = Objects.capitalizeKeys(input);
			expect(output.A).to.equal(1);
			expect(output.B).to.equal(2);
			expect(output.C).to.equal(3);
			expect(output.D.A).to.equal(1);
			expect(output.D.B).to.equal(2);
		});
	});

	describe('uncapitalizeKeys', () => {
		it('should uncapitalize all keys within the input object', () => {
			const input = { A: 1, B: 2, C: 3, D: { A: 1, B: 2 } };
			const output = Objects.uncapitalizeKeys(input);
			expect(output.a).to.equal(1);
			expect(output.b).to.equal(2);
			expect(output.c).to.equal(3);
			expect(output.d.a).to.equal(1);
			expect(output.d.b).to.equal(2);
		});
	});
};
