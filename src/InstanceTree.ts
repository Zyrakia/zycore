import { Arrays } from 'Arrays';
import { Strings } from 'Strings';

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

	/**
	 * Connects the the AncestryChanged event of the given instance,
	 * and calls the callback when the parent is undefined and locked.
	 *
	 * @param instance The instance to connect to.
	 * @param callback The callback to call when the parent is undefined.
	 * @returns The event connection.
	 */
	export function onDestroying(instance: Instance, cb: () => void) {
		return instance.AncestryChanged.Connect((_, parent) => {
			if (parent) return;

			try {
				instance.Parent = instance;
			} catch (e) {
				if (!typeIs(e, 'string')) return;
				if (!Strings.includes(e, 'locked')) return;
				cb();
			}
		});
	}

	/**
	 * Connects to the AncestryChanged event of the given instance,
	 * and calls tehc allback when the parent no longer has a parent.
	 * This will not disconnect the connection after the callback is called.
	 *
	 * To connect to the destroyed event, use {@link onDestroying}.
	 *
	 * @param instance The instance to connect to.
	 * @param callback The callback to call when the parent is undefined.
	 * @returns The event connection.
	 */
	export function onDeparented(instance: Instance, cb: () => void) {
		return instance.AncestryChanged.Connect((_, parent) => {
			if (!parent) cb();
		});
	}

	/**
	 * Runs through the instances children and looks for
	 * the first child of a given type, if not found
	 * it searches for an ObjectValue with the specified name,
	 * and returns the value if the value is of the given type.
	 *
	 * @param instance The instance to look in.
	 * @param className The type to look for.
	 * @param pointerName The name of the pointer to look for, defaults to className.
	 * @param preferPointer If true, it will look for the pointer first.
	 * @returns The first child of the given type, or undefined.
	 */
	export function findClassInChildren<T extends keyof Instances>(
		instance: Instance,
		className: T,
		pointerName = className,
		preferPointer = false,
	) {
		let found: Instances[T] | undefined;

		if (preferPointer) {
			found = findClassInPointerChildren(instance, className);
			if (!found) found = instance.FindFirstChildOfClass(className);
		} else {
			found = instance.FindFirstChildOfClass(className);
			if (!found) found = findClassInPointerChildren(instance, className);
		}

		return found;
	}

	/**
	 * Runs through the instances children and looks for
	 * the first ObjectValue with the specified name,
	 * and returns the value if the value is of the given type.
	 *
	 * @param instance The instance to look in.
	 * @param className The type to look for.
	 * @param pointerName The name of the pointer to look for, defualts to the className.
	 * @returns The value within the first ObjectValue that meets the criteria, or undefined.
	 */
	export function findClassInPointerChildren<T extends keyof Instances>(
		instance: Instance,
		className: T,
		pointerName = className,
	) {
		const pointer = instance.FindFirstChild(pointerName);
		if (pointer?.IsA('ObjectValue')) {
			const target = pointer.Value;
			if (target?.IsA(className)) return target;
		}
	}
}
