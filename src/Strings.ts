import { Numbers } from 'Numbers';

export namespace Strings {
	/**
	 * Returns a random character.
	 *
	 * @param random The random number generator.
	 * @returns A random character.
	 */
	export function randomChar(random = new Random()) {
		return string.char(random.NextInteger(97, 122));
	}

	/**
	 * Returns a random string of the specified length.
	 *
	 * @param length The length of the string to return.
	 * @param random The random number generator to use.
	 * @returns A random string of the specified length.
	 */
	export function random(length = 25, random = new Random()) {
		let s = '';
		Numbers.spread(1, length).forEach(() => (s += randomChar(random)));
		return s;
	}

	/**
	 * Removes whitespace from the beginning and end of a string.
	 * Graciously stolen from https://github.com/roblox-ts/string-utils
	 *
	 * @param str The string to trim.
	 * @returns The trimmed string.
	 */
	export function trim(str: string) {
		const [from] = string.match(str, '^%s*()') as LuaTuple<[number]>;
		const [trimmed] = (from > str.size() && '') || string.match(str, '.*%S', from);
		return trimmed as string;
	}

	/**
	 * Removes whitespace from the start of a string.
	 * Graciously stolen from https://github.com/roblox-ts/string-utils
	 *
	 * @param str The string to trim.
	 * @returns The trimmed string.
	 */
	export function trimStart(str: string) {
		const [from] = string.match(str, '^%s*()') as LuaTuple<[number]>;
		return (from > str.size() && '') || string.sub(str, from);
	}

	/**
	 * Removes whitespace from the end of a string.
	 * Graciously stolen from https://github.com/roblox-ts/string-utils
	 *
	 * @param str The string to trim.
	 * @returns The trimmed string.
	 */
	export function trimEnd(str: string) {
		const [from] = string.match(str, '^%s*') as LuaTuple<[number]>;
		return (from === str.size() && '') || string.match(str, '.*%S')[0];
	}

	/**
	 * Checks if a string starts with a given substring.
	 *
	 * @param str The string to check.
	 * @param search The substring to check for.
	 * @returns Whether the string starts with the substring.
	 */
	export function startsWith(str: string, search: string) {
		return string.sub(str, 0, search.size()) === search;
	}

	/**
	 * Checks if the string ends with the given search string.
	 *
	 * @param str The string to check.
	 * @param search The search string.
	 * @returns Whether the string ends with the search string.
	 */
	export function endsWith(str: string, search: string) {
		return string.sub(str, -search.size()) === search;
	}

	/**
	 * Returns a slice of the string.
	 *
	 * @param str The string to slice.
	 * @param from The start index. (1-based)
	 * @param to The end index. (1-based, default is the end of the string)
	 * @returns The slice.
	 */
	export function slice(str: string, from: number, to?: number) {
		return string.sub(str, from, to);
	}

	/**
	 * Checks if the string contains the given substring.
	 *
	 * @param str The string to check.
	 * @param sub The substring to check for.
	 * @param from The start index. (1-based)
	 * @returns Whether the string contains the substring.
	 */
	export function includes(str: string, search: string, from = 1) {
		return string.find(str, search, from, true)[0] !== undefined;
	}

	/**
	 * Returns the last word in a camel case string.
	 * Graciously stolen from https://devforum.roblox.com/t/r15-rthro-ragdolls/338580
	 *
	 * @param str The string to get the last word from.
	 * @returns The last word.
	 */
	export function lastCamel(str: string) {
		const index = str.size() - ((str.reverse().find('%u')[0] || str.size() + 1) - 1);
		let last = str.sub(index);
		[last] = last.gsub('%d+$', '');
		return last;
	}

	/**
	 * Returns all numbers in the specified string.
	 *
	 * @param str The string to get the numbers from.
	 * @returns The numbers.
	 */
	export function extractNumbers(str: string) {
		let result = '';
		str.gsub('%d+', (v) => (result += v));
		return result;
	}

	/**
	 * Truncates a string to the specified length, then adds a suffix.
	 *
	 * @param str The string to truncate.
	 * @param length The length to truncate to.
	 * @param suffix The suffix to add.
	 * @returns The truncated string.
	 */
	export function truncate(str: string, length: number, suffix = '...') {
		return str.size() > length ? str.sub(0, length) + suffix : str;
	}

	/**
	 * Pads the end of the passed string with the specified
	 * character until the string reaches the specified length.
	 *
	 * @param str The string to pad.
	 * @param length The length to pad to.
	 * @param char The character to pad with.
	 * @returns The padded string.
	 */
	export function padEnd(str: string, length: number, char = ' ') {
		return str.size() >= length ? str : str + char.rep(length - str.size());
	}

	/**
	 * Pads the beginning of the passed string with the specified
	 * character until the string reaches the specified length.
	 *
	 * @param str The string to pad.
	 * @param length The length to pad to.
	 * @param char The character to pad with.
	 * @returns The padded string.
	 */
	export function padStart<T extends string>(str: T, length: number, char = ' ') {
		return str.size() >= length ? str : char.rep(length - str.size()) + str;
	}

	/**
	 * Returns the input string with the first character capitalized.
	 *
	 * @param str The string to capitalize.
	 * @returns The capitalized string.
	 */
	export function capitalize<T extends string>(str: T) {
		return (slice(str, 0, 1).upper() + slice(str, 2)) as Capitalize<T>;
	}

	/**
	 * Returns the input string with the fist character lowercased.
	 *
	 * @param str The string to lowercase.
	 * @returns The lowercased string.
	 */
	export function uncapitalize<T extends string>(str: T) {
		return (slice(str, 0, 1).lower() + slice(str, 2)) as Uncapitalize<T>;
	}

	/**
	 * Returns an object that can be used to build a string.
	 *
	 * @param init The initial string, defaults to ''.
	 * @returns The string builder.
	 */
	export function builder(init = '') {
		return {
			/** The string being built.  */
			str: init,

			/**
			 * Append a string to the string being built.
			 *
			 * @param str The string to append.
			 */
			append: function (str: string) {
				this.str += str;
				return this;
			},

			/**
			 * Sets the string being built.
			 *
			 * @param str The string to set.
			 */
			set: function (str: string) {
				this.str = str;
				return this;
			},

			/**
			 * Sets the string being built to the initial string
			 * passed to the builder.
			 */
			clear: function () {
				this.str = init;
				return this;
			},

			/**
			 * Returns the string being built.
			 */
			toString: function () {
				return this.str;
			},
		};
	}
}
