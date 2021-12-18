import { Arrays } from 'Arrays';

export namespace InstanceTree {
	/**
	 * Calls the given callback for each descendant of the given instance.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each descendant.
	 */
	export function walk(instance: Instance, cb: (instance: Instance) => void) {
		instance.GetDescendants().forEach((descendant) => cb(descendant));
	}

	/**
	 * Calls the given callback for the given instance and each of it's descendants.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each descendant.
	 */
	export function walkInclusive(instance: Instance, cb: (instance: Instance) => void) {
		cb(instance);
		walk(instance, cb);
	}

	/**
	 * Calls the given callback for each child of the given instance.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each child.
	 */
	export function walkNear(instance: Instance, cb: (instance: Instance) => void) {
		instance.GetChildren().forEach((descendant) => cb(descendant));
	}

	/**
	 * Calls the given callback for the given instance and each of it's children.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each child.
	 */
	export function walkNearInclusive(instance: Instance, cb: (instance: Instance) => void) {
		cb(instance);
		walkNear(instance, cb);
	}

	/**
	 * Calls the given callback for each descendant of the given instance that is of the given type.
	 *
	 * @param instance The instance to start with.
	 * @param filter The type to filter by.
	 * @param cb The callback to call for each descendant.
	 */
	export function walkFilter<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
	) {
		instance.GetDescendants().forEach((descendant) => descendant.IsA(filter) && cb(descendant));
	}

	/**
	 * Calls the given callback for the instance if it is of the given type,
	 * and each of it's descendants that is of the given type.
	 *
	 * @param instance The instance to start with.
	 * @param filter The type to filter by.
	 * @param cb The callback to call for each descendant.
	 */
	export function walkFilterInclusive<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
	) {
		instance.IsA(filter) && cb(instance);
		walkFilter(instance, filter, cb);
	}

	/**
	 * Calls the given callback for each child of the given instance that is of the given type.
	 *
	 * @param instance The instance to start with.
	 * @param filter The type to filter by.
	 * @param cb The callback to call for each child.
	 */
	export function walkNearFilter<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
	) {
		instance.GetChildren().forEach((descendant) => descendant.IsA(filter) && cb(descendant));
	}

	/**
	 * Calls the given callback for the instance if it is of the given type,
	 * and each of it's children that is of the given type.
	 *
	 * @param instance The instance to start with.
	 * @param filter The type to filter by.
	 * @param cb The callback to call for each child.
	 */
	export function walkNearFilterInclusive<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
	) {
		instance.IsA(filter) && cb(instance);
		walkNearFilter(instance, filter, cb);
	}

	/**
	 * Gathers all of the ancestors of the given instance.
	 *
	 * @param instance The instance to start with.
	 * @returns The ancestors of the given instance.
	 */
	export function gatherAncestors(instance: Instance) {
		let ancestors = [];
		let parent = instance.Parent;

		while (parent) {
			ancestors.push(parent);
			parent = parent.Parent;
		}

		return ancestors;
	}

	/**
	 * Finds the first ancestor of the given instance that is not of the given type.
	 *
	 * @param instance The instance to start with.
	 * @param filter The type to filter by.
	 *
	 * @returns The first ancestor of the given instance that is not of the given type.
	 */
	export function findHighestAncestorNotOfClass<T extends keyof Instances>(
		instance: Instance,
		filter: T,
	) {
		const ancestors = gatherAncestors(instance);
		Arrays.reverse(ancestors);
		return ancestors.find((ancestor) => !ancestor.IsA(filter) && ancestor !== game) as
			| Instance
			| undefined;
	}

	/**
	 * Runs through the instance and it's descendants and
	 * ensures that Archivable is set to true
	 *
	 * @param instance The instance to unlock.
	 */
	export function cloneUnlock(instance: Instance) {
		walkInclusive(instance, (i) => (i.Archivable = true));
	}

	/**
	 * Runs through the instance and it's descendants and
	 * ensures that Archivable is set to false
	 *
	 * @param instance The instance to lock.
	 */
	export function cloneLock(instance: Instance) {
		walkInclusive(instance, (i) => (i.Archivable = false));
	}
}
