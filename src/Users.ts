import { Players } from '@rbxts/services';
import { Strings } from 'Strings';

export namespace Users {
	/**
	 * Returns a players full name formatted with their username
	 * and displayname. If both are the same, the name is returned.
	 *
	 * Example `xXx_Killer_xXx (@Killer)`
	 *
	 * @param player The player to get the name of.
	 * @param secondaryIndicator The indicator used before the secondary name. Default "@".
	 * @param primaryPreference The name that should appear first. Default "display".
	 */
	export function getFullName(
		player: Player,
		secondaryIndicator = '@',
		primaryPreference: 'user' | 'display' = 'display',
	) {
		return player.Name === player.DisplayName
			? player.Name
			: primaryPreference === 'user'
			? `${player.Name} (${secondaryIndicator} ${player.DisplayName})`
			: `${player.DisplayName} (${secondaryIndicator} ${player.Name})`;
	}

	/**
	 * Returns the name of the user with the given ID, if said user is online,
	 * it will not create a request, and return the display name if the
	 * `preferDisplayName` argument is set to true. If the player is not online
	 * it will address `Players.GetNameFromUserIdAsync` method, and return the
	 * result, if any. This means the method will yield if the player is not
	 * online.
	 *
	 * This function does not throw if the player with the specified ID does
	 * not exist, it will just return nothing.
	 *
	 * @param userId The ID of the user to get the name of.
	 * @param preferDisplayName Attempts to return the display name instead of the username. Default true.
	 * @returns The name of the user with
	 */
	export function getName(userId: number, preferDisplayName = true) {
		const onlinePlayer = Players.GetPlayerByUserId(userId);
		if (onlinePlayer) return preferDisplayName ? onlinePlayer.DisplayName : onlinePlayer.Name;

		try {
			const name = Players.GetNameFromUserIdAsync(userId);
			return name;
		} catch {}
	}

	/**
	 * Searches through the list of players and returns the first player
	 * that has a name or display name that matches the given name, optionally
	 * ignoring casing, whitespace. If fuzzy is set to true, it will also match
	 * for the first player which has a name or display name that contains the
	 * given name.
	 *
	 * Prioritizes the name, then the display name, then any fuzzy matches in the same order.
	 *
	 * @param name The name to search for.
	 * @param fuzzy Whether to match for the first player which has a name or display name that contains the given name. Default true.
	 * @param ignoreCasing Whether to ignore casing. Default true.
	 * @param ignoreWhitespace Whether to ignore whitespace. Default true.
	 * @returns The first player that has a name or display name that matches the given name.
	 */
	export function searchFor(
		name: string,
		fuzzy = true,
		ignoreCasing = true,
		ignoreWhitespace = true,
	) {
		if (!name) return;

		const caseAdjusted = ignoreCasing ? name.lower() : name;
		const search = ignoreWhitespace ? Strings.trim(caseAdjusted) : caseAdjusted;

		if (!search) return;

		for (const player of Players.GetPlayers()) {
			const name = ignoreCasing ? player.Name.lower() : player.Name;
			const dName = ignoreCasing ? player.DisplayName.lower() : player.DisplayName;

			if (name === search || dName === search) return player;
			if (!fuzzy) continue;
			if (Strings.includes(name, search) || Strings.includes(dName, search)) return player;
		}
	}
}
