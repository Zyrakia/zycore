import { Bin } from '@rbxts/bin';
import { Arrays } from 'Arrays';
import { Strings } from 'Strings';

const TweenService = game.GetService('TweenService');

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
	 * Calls the given callback for each descendant of the given instance that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
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
	 * Calls the given callback for the instance if it is of the given class,
	 * and each of it's descendants that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
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
	 * Calls the given callback for each child of the given instance that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
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
	 * Calls the given callback for the instance if it is of the given class,
	 * and each of it's children that is of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
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
	 * Gathers all of the ancestors of the given instance that
	 * are of the given class.
	 *
	 * @param instance The instance to start with.
	 * @param filter The class to filter by.
	 * @returns The ancestors of the given instance that are of the given class.
	 */
	export function gatherAncestorsFilter<T extends keyof Instances>(
		instance: Instance,
		filter: T,
	) {
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
	export function isUIVisible(instance: GuiObject) {
		if (!instance.Visible) return false;
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
			const found: Instances[T][] = [];
			InstanceTree.walkFilter(instance, className, (instance) => {
				if (instance.Name !== instanceName) return;
				found.push(instance);
			});

			return found[0];
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
	 * @returns A tuple of the ObjectValue and the instance found, or undefined.
	 */
	export function findReferencedChildOfClass<T extends keyof Instances>(
		instance: Instance,
		className: T,
		pointerName?: string,
		instanceName?: string,
	) {
		if (pointerName !== undefined) {
			const found: ObjectValue[] = [];
			InstanceTree.walkFilter(instance, 'ObjectValue', (value) => {
				if (value.Name !== pointerName) return;
				if (instanceName !== undefined && value.Value?.Name !== instanceName) return;
				if (!value.Value?.IsA(className)) return;

				found.push(value);
			});

			const value = found[0];
			if (!value) return;

			return value.Value as Instances[T];
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
	 * - BasePart: transparency, collision
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
	export function toggle(
		instance: Instance,
		enabled: boolean,
		recursive = false,
		info?: TweenInfo,
	) {
		if (instance.IsA('BasePart')) {
			if (info) TweenService.Create(instance, info, { Transparency: enabled ? 0 : 1 }).Play();
			else instance.Transparency = enabled ? 0 : 1;
			instance.CanCollide = enabled;
		} else if (instance.IsA('ParticleEmitter')) instance.Enabled = enabled;
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
	 * Checks if the specified property can be used to index
	 * the given instance and not thrown an error or return an instance.
	 *
	 * IMPORTANT: I tried to account for edge cases where the property
	 * of an instance points to an instance (like ObjectValue.Value), but I
	 * 100% forgot some. If you find a case where this function
	 * returns incorrect results, please report it to me. This all means
	 * that if you need a 100% accurate check, please don't use this.
	 *
	 * @param instance The instance to check on.
	 * @param property The property to check for.
	 * @returns Whether the property exists on the instance.
	 */
	export function hasProperty(instance: Instance, property: string) {
		try {
			// @ts-ignore
			const value = instance[property];

			if (typeIs(value, 'Instance')) {
				switch (property) {
					case 'Parent':
						return true;
					case 'PrimaryPart':
						if (instance.IsA('Model') || instance.IsA('Workspace')) return true;
						break;
					case 'Value':
						if (instance.IsA('ObjectValue')) return true;
						break;
					case 'Part0':
						if (instance.IsA('JointInstance')) return true;
						break;
					case 'Part1':
						if (instance.IsA('JointInstance')) return true;
						break;
					case 'Occupant':
						if (instance.IsA('Seat')) return true;
						break;
					case 'Attachment0':
						if (
							instance.IsA('Constraint') ||
							instance.IsA('PathfindingLink') ||
							instance.IsA('Beam') ||
							instance.IsA('Trail')
						)
							return true;

						break;
					case 'Attachment1':
						if (
							instance.IsA('Constraint') ||
							instance.IsA('PathfindingLink') ||
							instance.IsA('Beam') ||
							instance.IsA('Trail')
						)
							return true;

						break;
					case 'RootPart':
						if (instance.IsA('Humanoid')) return true;
						break;
					case 'SeatPart':
						if (instance.IsA('Humanoid')) return true;
						break;
					case 'CurrentCamera':
						if (instance.IsA('Workspace') || instance.IsA('ViewportFrame')) return true;
						break;
					case 'Target':
						if (instance.IsA('Mouse')) return true;
						break;
					case 'TargetFilter':
						if (instance.IsA('Mouse')) return true;
						break;
					case 'UnitRay':
						if (instance.IsA('Mouse')) return true;
						break;
					case 'WalkToPart':
						if (instance.IsA('Humanoid')) return true;
						break;
					case 'AssemblyRootPart':
						if (instance.IsA('BasePart')) return true;
						break;
					case 'Part0':
						if (instance.IsA('NoCollisionConstraint') || instance.IsA('WeldConstraint'))
							return true;

						break;
					case 'Part1':
						if (instance.IsA('NoCollisionConstraint') || instance.IsA('WeldConstraint'))
							return true;

						break;
				}

				return false;
			}

			return true;
		} catch {
			return false;
		}
	}
}
