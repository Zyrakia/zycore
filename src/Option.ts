/** Maps all keys in a type to have an Option type containing the original type. */
export type MapOptions<T> = { [K in keyof T]: Option<T[K]> };

/**
 * A utility class that has the ability to hold a value,
 * but is not required to. Similar to the Rust option class.
 *
 * Useful when filling an array where some spots may be empty,
 * since Lua does not iterate over nil.
 */
export class Option<T extends defined> {
	/**
	 * Constructs a new Option with it's initial value. It's recommended
	 * to use {@link Option.none} or {@link Option.some} instead.
	 *
	 * @param value The initial value of the option.
	 */
	public constructor(private value: T | undefined) {}

	/**
	 * Sets the value stored within this option.
	 *
	 * @param value The value to set.
	 * @returns The option instance.
	 */
	public set(value: T | undefined) {
		this.value = value;
		return this;
	}

	/**
	 * Returns the value stored inside of this option.
	 * In order to ensure the returning of a value,
	 * since the option may be storing undefined, pass
	 * in a default parameter to this function.
	 *
	 * @returns The value inside this option.
	 */
	public get(): T | undefined;

	/**
	 * Returns the value stored inside of this option.
	 * In order to ensure the returning of a value,
	 * since the option may be storing undefined, pass
	 * in a default parameter to this function.
	 *
	 * @param def The value to return if the stored value is undefined.
	 * @returns The value inside this option.
	 */
	public get(def: T): T;

	public get(def?: T) {
		return this.value ?? def;
	}

	/**
	 * Returns whether this option contanins a value that
	 * is not equal to undefined. This does not return a predicate,
	 * but does ensure, with a true response, that a subsequent {@link get} call
	 * will return a valid value, meaning you can safely `!` it.
	 */
	public isSome() {
		return this.value !== undefined;
	}

	/**
	 * Returns whether this option does not contain a value.
	 * Returns the inverse of {@link isSome}
	 */
	public isNone() {
		return !this.isSome();
	}

	/**
	 * Returns whether this option contains the
	 * specified value.
	 *
	 * @param value The value to check against.
	 * @returns Whether the stored and given values are referentially equal.
	 */
	public contains(value: T) {
		return this.value === value;
	}

	/**
	 * Returns the value stored within this option, and throws
	 * the specified error if the value is undefined, therefore
	 * ensuring that a proper value is returned.
	 */
	public expect(err: unknown) {
		if (this.isSome()) return this.value as T;
		throw err;
	}

	/**
	 * Creates a new option with nothing inside of it.
	 *
	 * @returns An empty option.
	 */
	public static none<T>() {
		return new Option<T>(undefined);
	}

	/**
	 * Creates a new option with a specific value inside of it.
	 *
	 * @param value The initial value of the option.
	 * @returns A filled option.
	 */
	public static some<T>(value: T) {
		return new Option(value);
	}

	/**
	 * Creates an array of none options with the given size.
	 *
	 * @param size The size of the nones array.
	 * @returns The array of empty options.
	 */
	public static nones<T>(size: number) {
		const options: Option<T>[] = [];
		for (let i = 0; i < size; i++) options.push(Option.none());
		return options;
	}
}
