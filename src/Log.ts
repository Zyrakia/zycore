import { Strings } from 'Strings';

export type LogMapping = { [key: string]: string };
export type FormatArgs = (string | number)[];

export namespace Log {
	/** Will be used to prefix all logs made with this namespace. */
	export let prefix = '';

	/** Will be appended to all logs made with this namepsace. */
	export let suffix = '';

	/**
	 * Adressed with every log made with this namespace, used
	 * to set messages that will get logged if a log function
	 * is called with the key of the message.
	 */
	export let mapping: LogMapping = {};

	/**
	 * Logs a message to the console.
	 *
	 * @param messageOrKey The key of the message in the mapping, or the message itself.
	 * @param args The arguments to be formatted into the message.
	 */
	export function info(messageOrKey: string, ...args: FormatArgs) {
		print(format(messageOrKey, ...args));
	}

	/**
	 * Logs a warning to the console.
	 *
	 * @param messageOrKey The key of the message in the mapping, or the message itself.
	 * @param args The arguments to be formatted into the message.
	 */
	export function warning(messageOrKey: string, ...args: FormatArgs) {
		warn(format(messageOrKey, ...args));
	}

	/**
	 * Logs an error to the console.
	 *
	 * @param messageOrKey The key of the message in the mapping, or the message itself.
	 * @param args The arguments to be formatted into the message.
	 */
	export function err(messageOrKey: string, ...args: FormatArgs) {
		error(format(messageOrKey, ...args), 2);
	}

	/**
	 * Logs an error to the console but spawns a new context to
	 * not terminate any relevant code.
	 *
	 * @param messageOrKey The key of the message in the mapping, or the message itself.
	 * @param args The arguments to be formatted into the message.
	 */
	export function errNonFatal(messageOrKey: string, ...args: FormatArgs) {
		task.spawn(() => error(format(messageOrKey, ...args), 3));
	}

	/**
	 * Formats a message with the given arguments and decorates
	 * it with the prefix and suffix if they are set.
	 *
	 * @param messageOrKey The key of the message in the mapping, or the message itself.
	 * @param args The arguments to be formatted into the message.
	 */
	function format(messageOrKey: string, ...args: FormatArgs) {
		const message = mapping[messageOrKey] || messageOrKey;
		return `${
			prefix ? (Strings.endsWith(prefix, ' ') ? prefix : `${prefix} `) : ''
		}${string.format(message, ...args)}${
			suffix ? (Strings.endsWith(suffix, ' ') ? suffix : ` ${suffix}`) : ''
		}`;
	}
}
