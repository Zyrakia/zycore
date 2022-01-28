import { typesAre } from 'safety/TypeChecking';

export = () => {
	describe('typesAre', () => {
		it('returns true if all types are matching', () => {
			expect(
				typesAre('string', 'BrickColor', 'CFrame')(
					'hello',
					BrickColor.Black(),
					new CFrame(),
				),
			).to.equal(true);
		});

		it('returns false if not all types are matching', () => {
			expect(
				typesAre('string', 'BrickColor', 'CFrame')(
					5 as unknown as string,
					BrickColor.Black(),
					new CFrame(),
				),
			).to.equal(false);
		});
	});
};
