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
	 * @param sub The substring to check for.
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
}