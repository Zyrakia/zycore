import { Workspace } from '@rbxts/services';
import { Strings } from 'Strings';

/**
 * Time units based in seconds, taken from Brave search
 * duration conversion table.
 *
 * @see https://search.brave.com/search?q=duration+conversion
 */
export enum TimeUnit {
	FEMTO = 1e-15,
	PICO = 1e-12,
	NANO = 1e-9,
	MICRO = 1e-6,
	MILLI = 0.001,
	SECOND = 1,
	MINUTE = 60,
	HOUR = 3600,
	DAY = 86400,
	WEEK = 6.048e5,
	MONTH = 2.6298e6,
	YEAR = 3.15576e7,
	DECADE = 3.15576e8,
	CENTURY = 3.15576e9,
	MILLENIUM = 3.15576e10,
	FORTNIGHT = 1.2096e6,
	SIDERIAL_YEAR = 3.155815e7,
}

export namespace Time {
	const UNIT_NAMES = [
		{ unit: TimeUnit.SIDERIAL_YEAR, name: 'siderial year' },
		{ unit: TimeUnit.FORTNIGHT, name: 'fortnight' },
		{ unit: TimeUnit.MILLENIUM, name: 'millenia' },
		{ unit: TimeUnit.CENTURY, name: 'centurie' },
		{ unit: TimeUnit.DECADE, name: 'decade' },
		{ unit: TimeUnit.YEAR, name: 'year' },
		{ unit: TimeUnit.MONTH, name: 'month' },
		{ unit: TimeUnit.WEEK, name: 'week' },
		{ unit: TimeUnit.DAY, name: 'day' },
		{ unit: TimeUnit.HOUR, name: 'hour' },
		{ unit: TimeUnit.MINUTE, name: 'minute' },
		{ unit: TimeUnit.SECOND, name: 'second' },
		{ unit: TimeUnit.MILLI, name: 'millisecond' },
		{ unit: TimeUnit.MICRO, name: 'microsecond' },
		{ unit: TimeUnit.NANO, name: 'nanosecond' },
		{ unit: TimeUnit.PICO, name: 'picosecond' },
		{ unit: TimeUnit.FEMTO, name: 'femtosecond' },
	];

	/**
	 * Equivalent to `Workspace.GetServerTimeNow()`.
	 */
	export function now() {
		return Workspace.GetServerTimeNow();
	}

	/**
	 * Equivalent to `tick()`.
	 */
	export function localNow() {
		return tick();
	}

	/**
	 * Gets the different between a start and end time.
	 *
	 * @param start The start time.
	 * @param fin The end time.
	 * @param unit An optional unit to convert the difference to, if specified, assumes the start and end times are in seconds.
	 * @returns The time difference in the specified time unit.
	 */
	export function diff(start: number, fin: number, unit?: TimeUnit) {
		const diff = fin - start;
		return unit !== undefined ? convert(diff, TimeUnit.SECOND, unit) : diff;
	}

	/**
	 * Converts the given time value from the given unit to the given unit.
	 *
	 * @param value The value to convert.
	 * @param from The unit to convert from.
	 * @param to The unit to convert to.
	 * @returns The converted value.
	 */
	export function convert(value: number, from: TimeUnit, to: TimeUnit) {
		return (value * from) / to;
	}

	/**
	 * Returns the seconds as a readable string going up to
	 * years, but does not include any 0 units.
	 *
	 * Example:
	 * Time.toReadableString(Time.convert(1, TimeUnit.YEAR, TimeUnit.SECOND) + 5) => "1 year, 5 seconds"
	 *
	 * @param seconds The seconds to format.
	 * @param upperLimit The upper TimeUnit to stop at, default is {@link TimeUnit.YEAR}.
	 * @param lowerLimit The lower TimeUnit to start at, default is {@link TimeUnit.SECOND}.
	 * @param excludedUnits An array of TimeUnit to exclude from the output, default is [{@link TimeUnit.FORTNIGHT}, {@link TimeUnit.SIDERIAL_YEAR}].
	 * @returns The formatted seconds.
	 */
	export function toReadableString(
		seconds: number,
		upperLimit = TimeUnit.YEAR,
		lowerLimit = TimeUnit.SECOND,
		excludedUnits: TimeUnit[] = [TimeUnit.FORTNIGHT, TimeUnit.SIDERIAL_YEAR],
	) {
		let remaining = seconds;
		const parts = [];

		for (const { unit, name } of UNIT_NAMES) {
			if (remaining < unit) continue;
			if (unit > upperLimit || unit < lowerLimit) continue;
			if (excludedUnits.includes(unit)) continue;

			const value = math.floor(remaining / unit);
			remaining -= value * unit;

			parts.push(`${value} ${name}${value !== 1 ? 's' : ''}`);
		}

		return parts.join(', ');
	}

	/**
	 * Pads the given number with zeros until it is 2 digits long.
	 *
	 * @param num The number to pad.
	 * @returns The padded number.
	 */
	function pad(num: number) {
		return Strings.padStart(tostring(num), 2, '0');
	}

	/**
	 * Returns the seconds as a readable string in the format of
	 * `hh{delimiter}mm{delimiter}ss` (05:10:12).
	 *
	 * This will loop over to 0 again if the given seconds is
	 * bigger than 24 hours.
	 *
	 * @param seconds The seconds to format.
	 * @param delimiter The delimiter to use, default is `:`.
	 * @param military Whether to return the time in military format (24 hour clock), default is `false`.
	 */
	export function toClock(seconds: number, delimiter = ':', military = false) {
		const hours = math.floor(seconds / 3600);
		const minutes = pad(math.floor((seconds % 3600) / 60));
		const secs = pad(math.floor(seconds % 60));

		return `${pad(
			military ? hours : hours % 12 || 12,
		)}${delimiter}${minutes}${delimiter}${secs}`;
	}

	/**
	 * Returns the seconds as a readable string in the format of
	 * `hh{delimiter}mm` (05:10).
	 *
	 * This will loop over to 0 again if the given seconds is
	 * bigger than 24 hours.
	 *
	 * @param seconds The seconds to format.
	 * @param delimiter The delimiter to use, default is `:`.
	 * @param military Whether to return the time in military format (24 hour clock), default is `false`.
	 */
	export function toClockHoursMinutes(seconds: number, delimiter = ':', military = false) {
		const hours = math.floor(seconds / 3600);
		const minutes = pad(math.floor((seconds % 3600) / 60));

		return `${pad(military ? hours : hours % 12 || 12)}${delimiter}${minutes}`;
	}

	/**
	 * Returns the seconds as a readable string in the format of
	 * `mm{delimiter}ss` (10:12).
	 *
	 * Unlike the other clock methods, this will rise the minutes to any number,
	 * it will not loop over to 0 again.
	 *
	 * @param seconds The seconds to format.
	 * @param delimiter The delimiter to use, default is `:`.
	 * @returns The formatted seconds.
	 */
	export function toClockMinutesSeconds(seconds: number, delimiter = ':') {
		const minutes = pad(math.floor(seconds / 60));
		const secs = pad(math.floor(seconds % 60));

		return `${minutes}${delimiter}${secs}`;
	}
}
