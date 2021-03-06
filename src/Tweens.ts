import { TweenService } from '@rbxts/services';

/** Unions all types that are Tweenable by the Roblox TweenService. */
export type Tweenable =
	| number
	| boolean
	| CFrame
	| Rect
	| Color3
	| UDim
	| UDim2
	| Vector2
	| Vector2int16
	| Vector3;

/** Returns all properties of the instance that are tweenable. */
export type TweenableProperties<T extends Instance> = ExtractMembers<
	WritableInstanceProperties<T>,
	Tweenable
>;

export namespace Tweens {
	/** Set of all type names that are Tweenable by the Roblox TweenService. */
	const tweenableTypeNames = new Set<keyof CheckableTypes>([
		'number',
		'boolean',
		'CFrame',
		'Rect',
		'Color3',
		'UDim',
		'UDim2',
		'Vector2',
		'Vector2int16',
		'Vector3',
	]);

	/**
	 * Tweens the given property of the given instance through all values in the
	 * given array. The tweens will be applied with the given tween info, all tweens
	 * will have the same info if a TweenInfo instance is provided, or a function could be
	 * provided which will be called for each tween, and should return a TweenInfo to
	 * use for that tween.
	 *
	 * @param instance The instance to tween
	 * @param property The property to tween
	 * @param values The values to tween through
	 * @param info The tween info to use
	 * @returns A promise that resolves when all tweens have completed
	 */
	export async function throughArray<
		T extends Instance,
		K extends keyof TweenableProperties<T>,
		V extends T[K][],
	>(
		instance: T,
		property: K,
		values: V,
		info: TweenInfo | (<I extends number>(i: I, nextValue: V[I]) => TweenInfo),
	) {
		let i = 0;
		let nextValue = values[i];

		function nextInfo() {
			if (typeIs(info, 'function')) {
				return info(i, nextValue);
			} else return info;
		}

		while (nextValue) {
			const tween = TweenService.Create(instance, nextInfo(), { [property]: nextValue } as any);
			tween.Play();
			tween.Completed.Wait();

			i++;
		}
	}

	/**
	 * For each of the provided properties, starts a new tween that will tween the value of the
	 * "to" instance to the value of the "from" instance. These tweens all happen at the same time.
	 *
	 * Think of it as transferring all the given properties from one instance
	 * to another, at the same time, through tweening.
	 *
	 * @param fromInst The instance to tween from
	 * @param toInst The instance to tween to
	 * @param properties The properties to tween
	 * @param info The tween info to use
	 * @returns A promise that resolves when all tweens have completed
	 */
	export async function transfer<
		A extends Instance,
		B extends Instance,
		K extends keyof TweenableProperties<A | B>,
	>(fromInst: A, toInst: B, properties: K | K[], info = new TweenInfo()) {
		const props = typeIs(properties, 'table') ? properties : [properties];
		const promises = props.map(async (property) => {
			const fromValue = fromInst[property] as (A | B)[K];
			const toValue = toInst[property] as (A | B)[K];
			if (fromValue === toValue) return;

			const tween = TweenService.Create(fromInst, info, { [property]: toValue } as any);
			tween.Play();
			tween.Completed.Wait();
		});

		await Promise.all(promises);
	}

	/**
	 * Returns whether the type name of the given value
	 * is tweenable by the Roblox TweenService.
	 */
	export function isTweenable(value: unknown): value is Tweenable {
		return tweenableTypeNames.has(typeOf(value));
	}
}
