/**
 * A level based permission manager.
 * Keeps track and allows assigning of levels to players,
 * and opens a few utility functions for comparing levels.
 */
export class LevelPermissionManager<PermLevel extends number> {
	/** A map that keeps track of each player and their permission level. */
	private permissionLevels = new Map<Player, PermLevel>();

	/**
	 * Constructs a new LevelPermissionManager.
	 *
	 * @param defaultLevel The default permission level of any unregistered player.
	 * @param masterLevel The optional level that supersedes all other levels.
	 */
	public constructor(private defaultLevel: PermLevel, private masterLevel?: PermLevel) {}

	/**
	 * Gets the permission level of a player.
	 * If the player is not registered, the default level is returned.
	 *
	 * @param player The player to get the permission level of.
	 * @returns The permission level of the player.
	 */
	public getLevel(player: Player) {
		const level = this.permissionLevels.get(player);
		if (level === undefined) return this.defaultLevel;
		return level;
	}

	/**
	 * Registers a player with a permission level.
	 * If the player is already registered, the level is updated.
	 *
	 * @param player The player to register.
	 * @param level The permission level to register the player with.
	 */
	public setLevel(player: Player, level: PermLevel) {
		this.permissionLevels.set(player, level);
	}

	/**
	 * Removes a player from the registered players.
	 * This means in the future, the default level will
	 * be used for any operations involving the player.
	 *
	 * @param player The player to remove.
	 * @returns Whether the player was removed.
	 */
	public removeLevel(player: Player) {
		return this.permissionLevels.delete(player);
	}

	/**
	 * Checks if the player is the master level.
	 *
	 * @param player The player to check.
	 * @returns Whether the player is the master level.
	 */
	public isMaster(player: Player) {
		return this.getLevel(player) === this.getMasterLevel();
	}

	/**
	 * Checks if the level of the player is
	 * above the specified level. If the player
	 * is the master level, true is returned.
	 *
	 * @param player The player to check.
	 * @param level The level to check against.
	 * @returns Whether the player is above the level.
	 */
	public isAboveLevel(player: Player, level: PermLevel) {
		if (this.isMaster(player)) return true;
		const playerLevel = this.getLevel(player);
		return playerLevel > level;
	}

	/**
	 * Checks if the level of the first player
	 * is above the level of the second player.
	 * If the first player is the master level,
	 * true is returned. If the second player is
	 * master level, and the first player is not,
	 * false is returned.
	 *
	 * @param first The first player to check.
	 * @param second The second player to check.
	 * @returns Whether the first player is above the second player.
	 */
	public isAbove(player: Player, player2: Player) {
		if (this.isMaster(player)) return true;
		if (this.isMaster(player2)) return false;

		const playerLevel = this.getLevel(player);
		const player2Level = this.getLevel(player2);
		return playerLevel > player2Level;
	}

	/**
	 * Checks if the level of the player is
	 * equal to the specified level. Whether the
	 * player is the master level does not matter
	 * in this operation.
	 *
	 * @param player The player to check.
	 * @param level The level to check against.
	 * @returns Whether the player's level is equal to the level.
	 */
	public isEqualLevel(player: Player, level: PermLevel) {
		const playerLevel = this.getLevel(player);
		return playerLevel === level;
	}

	/**
	 * Checks if the level of the first player
	 * is equal to the level of the second player.
	 * Whether any of the players are the master level
	 * does not matter in this operation.
	 *
	 * @param first The first player to check.
	 * @param second The second player to check.
	 * @returns Whether the first player's level is equal to the second player's level.
	 */
	public isEqual(player: Player, player2: Player) {
		const playerLevel = this.getLevel(player);
		const player2Level = this.getLevel(player2);
		return playerLevel === player2Level;
	}

	/**
	 * Checks if the level of the player is above
	 * or equal to the specified level. If the player
	 * is the master level, true is returned.
	 *
	 * @param player The player to check.
	 * @param level The level to check against.
	 * @returns Whether the player is above or equal to the level.
	 */
	public isAboveOrEqualLevel(player: Player, level: PermLevel) {
		if (this.isMaster(player)) return true;

		const playerLevel = this.getLevel(player);
		return playerLevel >= level;
	}

	/**
	 * Checks if the level of the first player
	 * is above or equal to the level of the second player.
	 * If the first player is the master level,
	 * true is returned. If the second player is
	 * master level, and the first player is not,
	 * false is returned.
	 *
	 * @param first The first player to check.
	 * @param second The second player to check.
	 * @returns Whether the first player is above or equal to the second player.
	 */
	public isAboveOrEqual(player: Player, player2: Player) {
		if (this.isMaster(player)) return true;
		if (this.isMaster(player2)) return false;

		const playerLevel = this.getLevel(player);
		const player2Level = this.getLevel(player2);
		return playerLevel >= player2Level;
	}

	/**
	 * Returns the default permission level.
	 */
	public getDefaultLevel() {
		return this.defaultLevel;
	}

	/**
	 * Sets the default permission level, this will
	 * be used for any unregistered players in new
	 * operations.
	 */
	public setDefaultLevel(level: PermLevel) {
		this.defaultLevel = level;
	}

	/**
	 * Returns the master permission level.
	 */
	public getMasterLevel() {
		return this.masterLevel;
	}

	/**
	 * Sets the master permission level.
	 */
	public setMasterLevel(level: PermLevel) {
		this.masterLevel = level;
	}

	/**
	 * Clears all registered players.
	 * This means all players will be treated
	 * as if they have the default level.
	 */
	public clear() {
		this.permissionLevels.clear();
	}
}
