import { PhysicsService, Players } from '@rbxts/services';
import { Tags } from 'Tags';

/**
 * Utility class to build raycast parameters.
 */
export class RayParams {
	private params = new RaycastParams();

	/**
	 * Adds the character of the specified player to the filter,
	 * if the player is not specified, it will attempt to use
	 * the local player. This does not wait for the character
	 * if it is not added.
	 *
	 * @param player The player to add to the filter
	 */
	public filterCharacter(player = Players.LocalPlayer) {
		const char = player?.Character;
		if (char) this.filter(char);
		return this;
	}

	/**
	 * Adds all instances tagged with the given tag to the filter.
	 *
	 * @param tag The tag to add to the filter
	 */
	public filterTagged(tag: string) {
		const instances = Tags.getTagged(tag);
		if (!instances.isEmpty()) this.filter(...instances);
		return this;
	}

	/**
	 * Adds the given instances to the filter.
	 *
	 * @param instances The instances to add to the filter
	 */
	public filter(...instances: Instance[]) {
		this.params.FilterDescendantsInstances = [...this.params.FilterDescendantsInstances, ...instances];
		return this;
	}

	/**
	 * Sets the filter type of the params to whitelist.
	 */
	public setToWhitelist() {
		this.params.FilterType = Enum.RaycastFilterType.Whitelist;
		return this;
	}

	/**
	 * Sets the filter type of the params to blacklist.
	 */
	public setToBlacklist() {
		this.params.FilterType = Enum.RaycastFilterType.Blacklist;
		return this;
	}

	/**
	 * Sets the filter type of the params to the specified type.
	 *
	 * @param filterType The filter type to set
	 */
	public setFilterType(filterType: Enum.RaycastFilterType) {
		this.params.FilterType = filterType;
		return this;
	}

	/**
	 * Sets whether the raycast that uses these params should ignore
	 * water.
	 *
	 * @param ignoreWater Whether to ignore water
	 */
	public setIgnoreWater(ignoreWater: boolean) {
		this.params.IgnoreWater = ignoreWater;
		return this;
	}

	/**
	 * Sets the collision group of the raycast that uses the params.
	 *
	 * @param collisionGroup The ID or name of the collision group
	 */
	public setCollisionGroup(collisionGroup: string | number) {
		const name = typeIs(collisionGroup, 'string')
			? collisionGroup
			: PhysicsService.GetCollisionGroupName(collisionGroup);

		this.params.CollisionGroup = name;
		return this;
	}

	/**
	 * Returns the internal raycast parameters.
	 */
	public get() {
		return this.params;
	}
}
