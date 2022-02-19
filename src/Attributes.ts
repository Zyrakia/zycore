import { t } from '@rbxts/t';

/** A type that unions all possible attribute values currently supported by Roblox. */
export type AttrValue =
	| string
	| boolean
	| number
	| UDim
	| UDim2
	| BrickColor
	| Color3
	| Vector2
	| Vector3
	| NumberSequence
	| ColorSequence
	| NumberRange
	| Rect
	| undefined;

export namespace Attributes {
	/**
	 * Sets all the given attributes on the specified instance.
	 *
	 * @param instance The instance to set the attributes on.
	 * @param attributes The attributes to set.
	 */
	export function setAll(instance: Instance, values: Record<string, AttrValue>) {
		for (const [key, value] of pairs(values)) instance.SetAttribute(key, value);
	}

	/**
	 * Gets the value of the given attribute on the specified instance.
	 *
	 * @param instance The instance to get the attribute from.
	 * @param key The attribute to get.
	 * @returns The value of the attribute, or undefined if the attribute doesn't exist.
	 */
	export function get(instance: Instance, key: string): AttrValue | undefined;

	/**
	 * Gets the value of the given attribute on the specified instance.
	 *
	 * @param instance The instance to get the attribute from.
	 * @param key The attribute to get.
	 * @param guard An optional guard that the value must pass to be returned.
	 * @returns The value of the attribute, or undefined if the attribute is invalid or doesn't exist.
	 */
	export function get<T extends AttrValue>(instance: Instance, key: string, guard: t.check<T>): T | undefined;

	export function get<T extends AttrValue>(instance: Instance, key: string, guard?: t.check<T>) {
		const value = instance.GetAttribute(key);
		if (guard && !guard(value)) return;
		return value;
	}

	/**
	 * Returns all the attributes on the specified instance.
	 *
	 * This function optionally takes a guard that acts as a lookup
	 * table of guards for each attribute. If a guard is defined, each
	 * attribute will only be returned if a guard for that attribute
	 * is defined and passed. If the guard is not specified, all
	 * attributes will be returned.
	 *
	 * @param instance The instance to get the attributes from.
	 */
	export function getAll(instance: Instance): Record<string, AttrValue | undefined>;

	/**
	 * Returns all the attributes on the specified instance.
	 *
	 * This function optionally takes a guard that acts as a lookup
	 * table of guards for each attribute. If a guard is defined, each
	 * attribute will only be returned if a guard for that attribute
	 * is defined and passed. If the guard is not specified, all
	 * attributes will be returned.
	 *
	 * @param instance The instance to get the attributes from.
	 * @param guard An optional guard to validate each attribute against.
	 */
	export function getAll<T extends Record<string, t.check<AttrValue>>>(
		instance: Instance,
		guard?: T,
	): { [K in keyof T]: T[K] extends t.check<infer U> ? U : never };

	export function getAll<T extends Record<string, t.check<AttrValue>>>(instance: Instance, guard?: T) {
		const attributes = instance.GetAttributes() as Record<string, AttrValue>;
		if (guard === undefined) return attributes;

		for (const [key, value] of pairs(attributes)) {
			if (!(key in guard) || !guard[key](value)) {
				delete attributes[key];
				continue;
			}
		}

		return attributes;
	}

	/**
	 * Sets all attributes on the specified instance to nil.
	 *
	 * @param instance The instance to clear the attributes on.
	 */
	export function clear(instance: Instance) {
		for (const [key] of pairs(getAll(instance))) instance.SetAttribute(key, undefined);
	}
}
