import { Colors, RGB } from 'Colors';

export = () => {
	describe('RGB', () => {
		it('should return a color from the given RGB values', () => {
			expect(RGB(255, 255, 255)).to.equal(new Color3(1, 1, 1));
			expect(RGB(0, 0, 0)).to.equal(new Color3(0, 0, 0));
			expect(RGB(255, 0, 0)).to.equal(new Color3(1, 0, 0));
			expect(RGB(0, 255, 0)).to.equal(new Color3(0, 1, 0));
			expect(RGB(0, 0, 255)).to.equal(new Color3(0, 0, 1));
		});
	});

	describe('sequence', () => {
		const generated = Colors.sequence(Colors.BLACK, Colors.WHITE, Colors.RED);

		const manual = new ColorSequence([
			new ColorSequenceKeypoint(0, Colors.BLACK),
			new ColorSequenceKeypoint(0.5, Colors.WHITE),
			new ColorSequenceKeypoint(1, Colors.RED),
		]);

		generated.Keypoints.forEach((v, i) => {
			expect(v.Value).to.equal(manual.Keypoints[i].Value);
			expect(v.Time).to.equal(manual.Keypoints[i].Time);
		});
	});
};
