import { Time, TimeUnit } from 'Time';

export = () => {
	describe('convert', () => {
		it('should convert from femto to pico', () => {
			expect(Time.convert(1, TimeUnit.FEMTO, TimeUnit.PICO)).to.equal(0.001);
		});

		it('should convert from pico to nano', () => {
			expect(Time.convert(1, TimeUnit.PICO, TimeUnit.NANO)).to.equal(0.001);
		});

		it('should convert from nano to micro', () => {
			expect(Time.convert(1, TimeUnit.NANO, TimeUnit.MICRO)).to.equal(0.001);
		});

		it('should convert from micro to milli', () => {
			expect(Time.convert(1, TimeUnit.MICRO, TimeUnit.MILLI)).to.equal(0.001);
		});

		it('should convert from milli to second', () => {
			expect(Time.convert(1, TimeUnit.MILLI, TimeUnit.SECOND)).to.equal(0.001);
		});

		it('should convert from year to month', () => {
			expect(Time.convert(1, TimeUnit.YEAR, TimeUnit.MONTH)).to.equal(12);
		});

		it('should convert from year to decade', () => {
			expect(Time.convert(1, TimeUnit.YEAR, TimeUnit.DECADE)).to.equal(0.1);
		});

		it('should convert from century to decade', () => {
			expect(Time.convert(1, TimeUnit.CENTURY, TimeUnit.DECADE)).to.equal(10);
		});

		it('should convert from century to millennium', () => {
			expect(Time.convert(1, TimeUnit.CENTURY, TimeUnit.MILLENIUM)).to.equal(0.1);
		});

		it('should convert from fortnight to day', () => {
			expect(Time.convert(1, TimeUnit.FORTNIGHT, TimeUnit.DAY)).to.equal(14);
		});

		it('should convert from day to hour', () => {
			expect(Time.convert(1, TimeUnit.DAY, TimeUnit.HOUR)).to.equal(24);
		});

		it('should convert from hour to minute', () => {
			expect(Time.convert(1, TimeUnit.HOUR, TimeUnit.MINUTE)).to.equal(60);
		});

		it('should convert from minute to second', () => {
			expect(Time.convert(1, TimeUnit.MINUTE, TimeUnit.SECOND)).to.equal(60);
		});
	});

	describe('toReadableString', () => {
		expect(Time.toReadableString(Time.convert(1, TimeUnit.YEAR, TimeUnit.SECOND) + 5)).to.equal(
			'1 year, 5 seconds',
		);
	});

	describe('toClock', () => {
		expect(Time.toClock(Time.convert(0.64, TimeUnit.DAY, TimeUnit.SECOND) + 5)).to.equal(
			'03:21:41',
		);

		expect(
			Time.toClock(Time.convert(0.64, TimeUnit.DAY, TimeUnit.SECOND) + 5, undefined, true),
		).to.equal('15:21:41');
	});

	describe('toClockHoursMinutes', () => {
		expect(
			Time.toClockHoursMinutes(Time.convert(0.64, TimeUnit.DAY, TimeUnit.SECOND) + 5),
		).to.equal('03:21');

		expect(
			Time.toClockHoursMinutes(
				Time.convert(0.64, TimeUnit.DAY, TimeUnit.SECOND) + 5,
				undefined,
				true,
			),
		).to.equal('15:21');
	});

	describe('toClockHoursMinutesSeconds', () => {
		expect(
			Time.toClockMinutesSeconds(Time.convert(0.64, TimeUnit.DAY, TimeUnit.SECOND) + 5),
		).to.equal('921:41');
	});
};
