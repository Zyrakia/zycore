import { Arrays } from 'Arrays';
import { Strings } from 'Strings';

import { Bin } from '@rbxts/bin';
import { ReplicatedStorage, ServerStorage, StarterPack, TweenService } from '@rbxts/services';
import { Make } from '@rbxts/altmake';

export namespace InstanceTree {
	/**
	 * Calls the given callback for each descendant of the given instance.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each descendant.
	 * @param inclusive Whether to call the callback for the given instance.
	 */
	export function walk(instance: Instance, cb: (instance: Instance) => void, inclusive = false) {
		if (inclusive) cb(instance);
		instance.GetDescendants().forEach((descendant) => cb(descendant));
	}

	/**
	 * Calls the given callback for each child of the given instance.
	 *
	 * @param instance The instance to start with.
	 * @param cb The callback to call for each child.
	 * @param inclusive Whether to call the callback for the given instance.
	 */
	export function walkNear(instance: Instance, cb: (instance: Instance) => void, inclusive = false) {
		if (inclusive) cb(instance);
		instance.GetChildren().forEach((descendant) => cb(descendant));
	}
	/**
	 * Calls the given callback for each descendant of the given instance that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
	 * @param cb The callback to call for each descendant.
	 * @param inclusive Whether to include the instance itself.
	 */
	export function walkFilter<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
		inclusive = false,
	) {
		if (inclusive && instance.IsA(filter)) cb(instance);
		instance.GetDescendants().forEach((descendant) => descendant.IsA(filter) && cb(descendant));
	}

	/**
	 * Calls the given callback for each child of the given instance that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
	 * @param cb The callback to call for each child.
	 * @param inclusive Whether to include the instance itself.
	 */
	export function walkNearFilter<T extends keyof Instances>(
		instance: Instance,
		filter: T,
		cb: (instance: Instances[T]) => void,
		inclusive = false,
	) {
		if (inclusive && instance.IsA(filter)) cb(instance);
		instance.GetChildren().forEach((descendant) => descendant.IsA(filter) && cb(descendant));
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
	 * Gathers all of the ancestors of the given instance that
	 * are of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
	 * @returns The ancestors of the given instance that are of the given class.
	 */
	export function gatherAncestorsFilter<T extends keyof Instances>(instance: Instance, filter: T) {
		let ancestors = [];
		let parent = instance.Parent;

		while (parent) {
			if (parent.IsA(filter)) ancestors.push(parent);
			parent = parent.Parent;
		}

		return ancestors;
	}

	/**
	 * Runs through the parents of the given instance
	 * and checks if any of them are set to `visible = false`.
	 *
	 * @param instance The instance to start with.
	 * @returns Whether or not the given UI element is visible.
	 */
	export function isUIVisible(instance: Instance) {
		if (instance.IsA('GuiObject') && !instance.Visible) return false;

		let parent = instance.Parent;

		while (parent) {
			if (!parent.IsA('GuiObject')) break;
			if (!parent.Visible) return false;
			parent = parent.Parent;
		}

		return true;
	}

	/**
	 * Connects to visibility changes of all ancestors of the given instance,
	 * and calls the callback when any of them change. Also watches for ancestry
	 * changes in case the given instance is moved.
	 *
	 * @param instance The instance to watch.
	 * @param cb The callback to call when visibility changes.
	 * @returns A bin that can be destroyed to stop all connections.
	 */
	export function onUIVisibilityChange(instance: GuiObject, cb: (visible: boolean) => void) {
		let lastVisible = false;

		const bin = new Bin();
		const visibilityBin = new Bin();
		bin.add(visibilityBin);

		function updateVisible() {
			const visible = isUIVisible(instance);

			if (visible === lastVisible) return;
			lastVisible = visible;

			cb(visible);
		}

		function checkAndConnectAncestors() {
			visibilityBin.destroy();

			for (const a of gatherAncestorsFilter(instance, 'GuiObject')) {
				const conn = a.GetPropertyChangedSignal('Visible').Connect(() => updateVisible());
				visibilityBin.add(conn);
			}

			updateVisible();
		}

		checkAndConnectAncestors();
		bin.add(instance.AncestryChanged.Connect(() => checkAndConnectAncestors()));

		return bin;
	}

	/**
	 * Finds the first ancestor of the given instance that is not of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
	 * @returns The first ancestor of the given instance that is not of the given class.
	 */
	export function findHighestAncestorNotOfClass<T extends keyof Instances>(instance: Instance, filter: T) {
		const ancestors = gatherAncestors(instance);
		Arrays.reverse(ancestors);
		return ancestors.find((ancestor) => !ancestor.IsA(filter) && ancestor !== game) as Instance | undefined;
	}

	/**
	 * Runs through the instance and it's descendants and
	 * ensures that Archivable is set to true
	 *
	 * @param instance The instance to unlock.
	 */
	export function cloneUnlock(instance: Instance) {
		walk(instance, (i) => (i.Archivable = true), true);
	}

	/**
	 * Runs through the instance and it's descendants and
	 * ensures that Archivable is set to false
	 *
	 * @param instance The instance to lock.
	 */
	export function cloneLock(instance: Instance) {
		walk(instance, (i) => (i.Archivable = false), true);
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
	 * Runs through the children of the given instance and looks for the
	 * first direct child of the given class or first referenced child
	 * (in a ObjectValue/Pointer) of the given class.
	 *
	 * @param instance The instance to look in.
	 * @param className The class to look for.
	 * @param preferReference If true, will look for a referenced match first.
	 * @param instanceName If specified, includes the instance name matching in the search criteria (only if not searching for reference).
	 * @param pointerName If specified, includes the pointer name matching in the search criteria.
	 * @returns The first child of the given class.
	 */
	export function findChildOfClassThorough<T extends keyof Instances>(
		instance: Instance,
		className: T,
		preferReference = false,
		instanceName?: string,
		pointerName?: string,
	) {
		let found;
		if (preferReference) {
			found = findReferencedChildOfClass(instance, className, pointerName);
		} else found = findChildOfClass(instance, className, instanceName);

		if (found) return found;

		if (preferReference) found = findChildOfClass(instance, className, instanceName);
		else found = findReferencedChildOfClass(instance, className, pointerName);

		return found;
	}

	/**
	 * Runs through the children of the given instance and looks for the first
	 * child of the given class.
	 *
	 * @param instance The instance to look in.
	 * @param className The class to look for.
	 * @param instanceName If specified, looks for the first child of the given class with the given name.
	 * @returns The first child of the given class, or undefined.
	 */
	export function findChildOfClass<T extends keyof Instances>(
		instance: Instance,
		className: T,
		instanceName?: string,
	) {
		if (instanceName !== undefined) {
			for (const child of instance.GetChildren()) {
				if (!child.IsA(className)) continue;
				if (child.Name !== instanceName) continue;
				return child;
			}

			return;
		}

		return instance.FindFirstChildOfClass(className);
	}

	/**
	 * Runs through the ObjectValue children of the given instance
	 * and looks for the first one that contains an instance of the given class.
	 *
	 * @param instance The instance to look in.
	 * @param className The class to look for.
	 * @param pointerName If specified, looks for the first ObjectValue with the given name.
	 * @param instanceName If specified, checks if the ObjectValue contains an instance with the given name aswell.
	 * @returns The found instance, or undefined.
	 */
	export function findReferencedChildOfClass<T extends keyof Instances>(
		instance: Instance,
		className: T,
		pointerName?: string,
		instanceName?: string,
	) {
		if (pointerName !== undefined) {
			for (const child of instance.GetChildren()) {
				if (!child.IsA('ObjectValue')) continue;
				if (child.Name !== pointerName) continue;

				const value = child.Value;

				if (instanceName !== undefined && value?.Name !== instanceName) continue;
				if (!value?.IsA(className)) continue;

				return value;
			}
		}

		const found = instance.FindFirstChildOfClass('ObjectValue');
		if (!found) return;

		const foundInstance = found.Value;
		if (!foundInstance?.IsA(className)) return;

		return foundInstance;
	}

	/**
	 * Runs through the instance and toggles various properties depending
	 * on the class of the instance. If recursive is true, it will also
	 * toggle all the descendants.
	 *
	 * This function is very subject to change, always read the list below
	 * to know exactly what is going to happen. This function is mostly
	 * for myself to use, but you can contribute your own changes to it
	 * if you want.
	 *
	 * Toggled instances:
	 * - ParticleEmitter: enabled
	 * - Trail: enabled
	 * - Decal: transprancy
	 * - Sound: playing
	 * - Light: enabled
	 * - AnimationTrack: play/stop
	 * - BaseScript: enabled
	 * - Constraint: enabled
	 * - JointInstance: enabled
	 * - LayerCollector: enabled
	 * - GUIObject: visible
	 *
	 * @param instance The instance to toggle.
	 * @param enabled Whether to enable or disable the instance.
	 * @param recursive Whether to toggle the descendants.
	 * @param info If specified, will tween the given property with the given info (if possible).
	 */
	export function toggle(instance: Instance, enabled: boolean, recursive = false, info?: TweenInfo) {
		if (instance.IsA('ParticleEmitter')) instance.Enabled = enabled;
		else if (instance.IsA('Trail')) instance.Enabled = enabled;
		else if (instance.IsA('Decal')) {
			if (info) TweenService.Create(instance, info, { Transparency: enabled ? 0 : 1 }).Play();
			else instance.Transparency = enabled ? 0 : 1;
		} else if (instance.IsA('Sound')) instance.Playing = enabled;
		else if (instance.IsA('Light')) instance.Enabled = enabled;
		else if (instance.IsA('AnimationTrack')) {
			if (enabled) instance.Play();
			else instance.Stop();
		} else if (instance.IsA('BaseScript')) instance.Disabled = !enabled;
		else if (instance.IsA('Constraint')) instance.Enabled = enabled;
		else if (instance.IsA('JointInstance')) instance.Enabled = enabled;
		else if (instance.IsA('LayerCollector')) instance.Enabled = enabled;
		else if (instance.IsA('GuiObject')) instance.Visible = enabled;

		if (!recursive) return;
		for (const child of instance.GetChildren()) toggle(child, enabled, true, info);
	}

	/**
	 * Iterates over the instances children and aggregates the mass
	 * of all BaseParts.
	 *
	 * @param instance The instance to iterate over.
	 * @param recursive Whether to recursively iterate over the whole descendant tree. Default is false.
	 * @returns The mass of the instance.
	 */
	export function collectMass(instance: Instance, recursive = false): number {
		return instance.GetChildren().reduce((acc, inst) => {
			if (inst.IsA('BasePart')) return (acc += inst.Mass);
			if (!recursive) return acc;
			return acc + collectMass(inst, true);
		}, 0);
	}

	/**
	 * Returns whether the given instance is a descendant of
	 * replicated/server storage or starter pack.
	 *
	 * @param instance The instance to check.
	 * @returns Whether the given instance is stored.
	 */
	export function isStored(instance: Instance) {
		return (
			instance.IsDescendantOf(ReplicatedStorage) ||
			instance.IsDescendantOf(ServerStorage) ||
			instance.IsDescendantOf(StarterPack)
		);
	}

	/**
	 * Registers all descendants, now and in the future, with the specified callback.
	 *
	 * @param instance The instance to register all descendants of.
	 * @param cb The callback to call with each descendant.
	 * @param inclusive Whether to register the given instance aswell, defaults to false.
	 * @returns The `DescendantAdded` connection.
	 */
	export function register(instance: Instance, cb: (instance: Instance) => void, inclusive = false) {
		walk(instance, cb, inclusive);
		return instance.DescendantAdded.Connect(cb);
	}

	/**
	 * Registers all children, now and in the future, with the specified callback.
	 *
	 * @param instance The instance to register all children of.
	 * @param cb The callback to call with each child.
	 * @param inclusive Whether to register the given instance aswell, defaults to false.
	 * @returns The `ChildAdded` connection.
	 */
	export function registerNear(instance: Instance, cb: (instance: Instance) => void, inclusive = false) {
		walkNear(instance, cb, inclusive);
		return instance.ChildAdded.Connect(cb);
	}

	/**
	 * Finds the first child which is of the given class, uses `isA()`.
	 * If no child is found, creates a new one and returns it.
	 *
	 * @param instance The instance to find the child of.
	 * @param className The class name to find.
	 * @returns The found or created child.
	 */
	export function ensureChildWhichIsA<T extends keyof CreatableInstances>(instance: Instance, className: T) {
		const child = instance.FindFirstChildWhichIsA(className);
		return child ?? new Instance(className, instance);
	}

	/**
	 * Registers all either children or descendants, with the specified callback, now and in the future.
	 * If you only specificy the `childAdded` callback, it will only connect to the `ChildAdded` event,
	 * and so on.
	 *
	 * @param inst The instances to register.
	 * @param handlers The handlers to connect to.
	 * @param inclusive Whether to register the given instance aswell, defaults to false.
	 * @returns A bin that can be destroyed to clear all connections.
	 */
	export function watch(
		inst: Instance,
		handlers: {
			childAdded?: (child: Instance) => void;
			childRemoved?: (child: Instance) => void;
			descendantAdded?: (descendant: Instance) => void;
			descendantRemoving?: (descendant: Instance) => void;
		},
		inclusive = false,
	) {
		const bin = new Bin();

		if (handlers.childAdded) {
			bin.add(inst.ChildAdded.Connect(handlers.childAdded));
			walkNear(inst, handlers.childAdded, inclusive);
		}

		if (handlers.childRemoved) bin.add(inst.ChildRemoved.Connect(handlers.childRemoved));

		if (handlers.descendantAdded) {
			bin.add(inst.DescendantAdded.Connect(handlers.descendantAdded));
			walk(inst, handlers.descendantAdded, inclusive);
		}

		if (handlers.descendantRemoving) bin.add(inst.DescendantRemoving.Connect(handlers.descendantRemoving));

		return bin;
	}
}
