/** Represents the constructor of `T`. */
export type Constructor<T> = {
	new (...args: any[]): T;
};

export namespace Meta {
	/**
	 * Converts the given class constructor into a string.
	 *
	 * @param constructor The class constructor to convert.
	 * @returns The string name of the constructor.
	 */
	export function getConstructorName(constructor: Constructor<any>) {
		return tostring(constructor);
	}

	/**
	 * Returns the name of the given objects constructor.
	 *
	 * This will throw if the given object does not have a constructor
	 * obtainable by {@link getConstructor}.
	 *
	 * @param obj The object to get the constructor name of.
	 * @returns The name of the constructor.
	 */
	export function getName(obj: object) {
		return getConstructorName(getConstructor(obj));
	}

	/**
	 * Returns the value of `__index` on the metatable of the given object.
	 * This is the constructor if provided with a class instance, otherwise the type is
	 * incorrect. So make sure you use this with instances.
	 *
	 * This throws if the metatable of the given object does not have a metatable
	 * with an `__index` field.
	 *
	 * @param obj The object to get the constructor of.
	 * @returns The constructor of the object.
	 */
	export function getConstructor<T extends object>(obj: T) {
		const meta = getmetatable(obj);
		if (typeIs(meta, 'table') && '__index' in meta) return (meta as { __index: Constructor<T> }).__index;
		else throw 'The metatable of the given object has no __index field.';
	}
}
