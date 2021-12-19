import promiseR15, { promiseR6 } from '@rbxts/promise-character';
import { promiseChildOfClass } from '@rbxts/promise-child';

export namespace Character {
	/**
	 * Returns the character model of the player.
	 *
	 * @param player The player to get the character model of.
	 * @returns A promise that resolves with the character model of the player.
	 */
	export async function get(player: Player) {
		return player.Character || Promise.fromEvent(player.CharacterAdded);
	}

	/**
	 * Returns the character model of the player.
	 *
	 * @param player The player to get the character model of.
	 * @returns The character model of the player.
	 */
	export function getSync(player: Player) {
		return player.Character || player.CharacterAdded.Wait()[0];
	}

	/**
	 * Promises for the R15 character rig of the player.
	 *
	 * @param player The player to get the R15 character rig of.
	 * @returns A promise that resolves with the R15 character rig of the player.
	 */
	export async function getRig(player: Player) {
		const char = await get(player);
		return promiseR15(char);
	}

	/**
	 * Promises for the R6 character rig of the player.
	 *
	 * @param player The player to get the R6 character rig of.
	 * @returns A promise that resolves with the R6 character rig of the player.
	 */
	export async function getRigR6(player: Player) {
		const char = await get(player);
		return promiseR6(char);
	}

	/**
	 * Promises for either the R15 or the R6 character rig of the player,
	 * depending on what type their Humanoid specifies.
	 *
	 * @param player The player to get the character rig of.
	 * @returns A promise that resolves with the character rig of the player.
	 * @throws If the specified rig type is not R15 or R6.
	 */
	export async function getRigEither(player: Player) {
		const char = await get(player);
		const rigType = (await promiseChildOfClass(char, 'Humanoid')).RigType.Name;
		if (rigType === 'R6') return promiseR6(char);
		if (rigType === 'R15') return promiseR15(char);
		throw `Unhandled RigType: ${rigType} on ${char.Name}!`;
	}
}
