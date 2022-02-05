import { CollectionService } from '@rbxts/services';

export namespace Tags {
	/**
	 * Adds a tag to the specified instances.
	 *
	 * @param tag The tag to add.
	 * @param instances The instances to add the tag to.
	 */
	export function add(tag: string, ...instances: Instance[]) {
		instances.forEach((i) => CollectionService.AddTag(i, tag));
	}

	/**
	 * Removes a tag from the specified instances.
	 *
	 * @param tag The tag to remove.
	 * @param instances The instances to remove the tag from.
	 * @returns The instances that had the tag.
	 */
	export function remove(tag: string, ...instances: Instance[]) {
		instances.forEach((i) => CollectionService.RemoveTag(i, tag));
	}

	/**
	 * Checks if the specified instances have the specified tag.
	 *
	 * @param tag The tag to check for.
	 * @param instances The instances to check.
	 * @returns Whether or not the instances have the tag.
	 */
	export function has(tag: string, ...instances: Instance[]) {
		return instances.every((i) => CollectionService.HasTag(i, tag));
	}

	/**
	 * Returns all instances that have the specified tag.
	 *
	 * @param tag The tag to check for.
	 * @returns The instances that have the tag.
	 */
	export function getTagged(tag: string) {
		return CollectionService.GetTagged(tag);
	}

	/**
	 * Returns all the tags on the specified instance.
	 *
	 * @param instances The instances to check.
	 * @returns The tags tagged by the instances.
	 */
	export function getTags(instance: Instance) {
		return CollectionService.GetTags(instance);
	}

	/**
	 * Clears all tags applied to the specified instance.
	 *
	 * @param instance The instance to clear tags from.
	 * @returns The instance with the tags cleared.
	 */
	export function clearTags(instance: Instance) {
		const tags = CollectionService.GetTags(instance);
		tags.forEach((tag) => CollectionService.RemoveTag(instance, tag));
		return tags;
	}

	/**
	 * Connects a callback that is called every time
	 * the specified tag is added to an instance.
	 *
	 * @param tag The tag to connect to.
	 * @param cb The callback to call.
	 * @returns The connection.
	 */
	export function onAdded(tag: string, cb: (instance: Instance) => void) {
		return CollectionService.GetInstanceAddedSignal(tag).Connect(cb);
	}

	/**
	 * Connects a callback that is called every time
	 * the specified tag is removed from an instance.
	 *
	 * @param tag The tag to check for.
	 * @param cb The callback to call.
	 * @returns The connection.
	 */
	export function onRemoved(tag: string, cb: (instance: Instance) => void) {
		return CollectionService.GetInstanceRemovedSignal(tag).Connect(cb);
	}
}
