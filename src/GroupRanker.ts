import { Objects } from 'Objects';

import { Ping } from '@rbxts/ping';
import { GroupService, Players, RunService } from '@rbxts/services';

export type RankMapping<T> = { [key: number]: T | undefined };

/**
 * A utility class that allows allocation of
 * identifiers to players depending on their
 * rank in a Roblox group.
 */
export class GroupRanker<Identifier> {
	private rankToIdentifier = new Map<number, Identifier>();
	private playerToIdentifier = new Map<Player, Identifier>();

	private identifyPing = new Ping<[player: Player, identifier: Identifier]>();

	/** A ping that fires whenever a player is assigned an identifier. */
	public readonly onIdentified = this.identifyPing.connector;

	private mapping: [number, Identifier | undefined][];

	/**
	 * Creates a new GroupRanker, each key in the mapping should
	 * correspond to a rank in the group, and the value should
	 * be the identifier that should be given to the player
	 * if they have that rank.
	 *
	 * Example Mapping:
	 * ```ts
	 * const mapping = {
	 *   255: 'owner', // If the player has a rank over or equal to 255, they will be given the identifier 'owner'
	 *   254: 'admin', // If the player has a rank over or equal to 254, they will be given the identifier 'admin'
	 *   253: 'mod', // If the player has a rank over or equal to 253, they will be given the identifier 'mod'
	 * }
	 * ```
	 *
	 * This mapping is calculated top-down, so if a player is grater or equal to multiple ranks,
	 * the uppermost key-value pair will be used. In the example above, this would mean it would check
	 * against 255 first, then 254, then 253.
	 *
	 * @param groupID The group ID to use for the ranker
	 * @param mapping The mapping of ranks to identifiers
	 */
	public constructor(private groupID: number, mapping: RankMapping<Identifier>) {
		this.mapping = GroupRanker.formatMapping(mapping);
	}

	public get(player: Player): Identifier | undefined;
	public get(player: Player, def: Identifier): Identifier;

	/**
	 * Allocates an identifier to the player depending on the group rank
	 * of the player and the mapping.
	 *
	 * If a rank already exists for the player, it will be returned.
	 * Otherwise, it will fetch the rank of the player,
	 * run through the keys in the mapping, and for each key, it
	 * will check if the player has a rank that matches the key
	 * or is higher than the key. If it does, it will allocate and return
	 * the matching identifier.
	 *
	 * This means that this function will yield if the player
	 * has not yet been allocated an identifier.
	 *
	 * If the user is not in the group, it will return undefined.
	 *
	 * @param player The player to allocate an identifier to
	 * @param def The default identifier to return if no identifier is found
	 * @returns The rank identifier of the player
	 */
	public get(player: Player, def?: Identifier) {
		const existing = this.playerToIdentifier.get(player);
		if (existing) return existing;

		const rank = this.getRankInGroup(player);
		if (rank === undefined) return;

		let identifier = this.findIdentifier(rank);
		if (identifier === undefined) {
			if (def === undefined) return;
			identifier = def;
		}

		this.set(player, identifier);
		return identifier;
	}

	/**
	 * Sets the rank of the player to the specified rank.
	 */
	public force(player: Player, rank: Identifier) {
		this.set(player, rank);
	}

	/**
	 * Removes the rank identifier of the player
	 * from the cache.
	 *
	 * @param player The player to remove.
	 */
	public forget(player: Player) {
		this.playerToIdentifier.delete(player);
	}

	/**
	 * Destroyes the {@link onIdentified} ping, and clears the cache.
	 */
	public destroy() {
		this.identifyPing.destroy();
		this.playerToIdentifier.clear();
	}

	/**
	 * Sets the mapping of the ranker.
	 * This will not invalidate the existing identifiers..
	 */
	public setMapping(mapping: RankMapping<Identifier>) {
		this.mapping = GroupRanker.formatMapping(mapping);
		this.rankToIdentifier.clear();
	}

	/**
	 * Returns the group info of the group that
	 * matches the group ID of the ranker.
	 */
	private getRankInGroup(player: Player) {
		if (RunService.IsClient() && player === Players.LocalPlayer) {
			const rank = player.GetRankInGroup(this.groupID);
			if (rank === 0) return;
			return rank;
		}

		const allGroups = GroupService.GetGroupsAsync(player.UserId);

		const match = allGroups.find((group) => group.Id === this.groupID);
		return match?.Rank;
	}

	/**
	 * Returns the appropriate identifier of the specified rank.
	 */
	private findIdentifier(rank: number) {
		const existing = this.rankToIdentifier.get(rank);
		if (existing) return existing;

		let identifier;
		for (const [key, value] of this.mapping) {
			if (rank < key || value === undefined) continue;
			identifier = value;
			break;
		}

		if (identifier) this.rankToIdentifier.set(rank, identifier);
		return identifier;
	}

	/**
	 * Sets the identifier of the player
	 * and updates the {@link onIdentified} ping.
	 */
	private set(player: Player, identifier: Identifier) {
		this.playerToIdentifier.set(player, identifier);
		this.identifyPing.fire(player, identifier);
	}

	/**
	 * Formats and validates the mapping of the ranker and
	 * throws if the mapping is invalid.
	 */
	private static formatMapping<T>(mapping: RankMapping<T>) {
		const sortedMapping = Objects.sortedPairs(mapping);

		for (const [key] of sortedMapping) {
			if (key < 0) throw 'A rank cannot be less than 0!';
			else if (key > 255) throw 'A rank cannot be greater than 255!';
		}

		return sortedMapping;
	}
}
