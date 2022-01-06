export namespace Users {
	/**
	 * Returns a players full name formatted with their username
	 * and displayname. If both are the same, the name is returned.
	 *
	 * Example `xXx_Killer_xXx (@Killer)`
	 *
	 * @param player The player to get the name of.
	 * @param secondaryIndicator The indicator used before the secondary name. Default "@".
	 * @@param primaryPreference The name that should appear first. Default "display".
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
}
