import { setTimeout, Timeout } from 'Interval';
import { PartEffects } from 'PartEffects';

export namespace Debris {
	/**
	 * Default lifetime seconds  for any debris added.
	 * This will be used if a lifetime parameter is not
	 * specified.
	 *
	 * By default, this is set to 5 seconds.
	 */
	export let defaultLifetime = 5;

	/**
	 * Registers instances as debris.
	 * The instances passed will automatically
	 * be destroyed after the specified lifetime.
	 *
	 * @param items The instance(s) to register as debris.
	 * @param lifetime The lifetime of the debris, {@link defaultLifetime} by default.
	 * @returns A tuple containing the destruction {@link Timeout} and the items passed.
	 */
	export function add(
		items: Instance | Instance[],
		lifetime = defaultLifetime,
	): [timeout: Timeout, items: Instance[]] {
		const itemsArray = typeIs(items, 'Instance') ? [items] : items;
		return [setTimeout(() => itemsArray.forEach((i) => i.Destroy()), lifetime), itemsArray];
	}

	/**
	 * Registers parts as debris.
	 * The parts passed will be sunk and faded by the
	 * {@link PartEffects.sink} function and then destroyed
	 * automatically when the sink animation is complete.
	 *
	 * @param items The part(s) to register as debris.
	 * @param lifetime The lifetime of the debris, {@link defaultLifetime} by default.
	 * @param sinkSpeed The speed at which the part sinks, sent to the sink method.
	 * @returns A tuple containing the destruction {@link Timeout} and the items passed.
	 */
	export function addSinking(items: BasePart | BasePart[], lifetime = defaultLifetime, sinkSpeed = 0.01) {
		const itemsArray = typeIs(items, 'Instance') ? [items] : items;

		return [
			setTimeout(() => {
				itemsArray.forEach((i) => PartEffects.sink(i, sinkSpeed).then(() => i.Destroy()));
			}, lifetime),
			itemsArray,
		];
	}
}
