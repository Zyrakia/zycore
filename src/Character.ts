import promiseR15, { CharacterRigR15, CharacterRigR6, promiseR6 } from '@rbxts/promise-character';
import { promiseChildOfClass } from '@rbxts/promise-child';

export namespace Character {
	export async function get(player: Player) {
		return player.Character || Promise.fromEvent(player.CharacterAdded);
	}

	export function getSync(player: Player) {
		return player.Character || player.CharacterAdded.Wait()[0];
	}

	export async function getRig(player: Player) {
		const char = await get(player);
		return promiseR15(char);
	}

	export function getRigSync(player: Player) {
		return getRig(player).await()[1] as CharacterRigR15;
	}

	export async function getRigR6(player: Player) {
		const char = await get(player);
		return promiseR6(char);
	}

	export function getRigR6Sync(player: Player) {
		return getRigR6(player).await()[1] as CharacterRigR6;
	}

	export async function getRigEither(player: Player) {
		const char = await get(player);
		const type = (await promiseChildOfClass(char, 'Humanoid')).RigType.Name;
		if (type === 'R6') return promiseR6(char);
		if (type === 'R15') return promiseR15(char);
		throw `Unhandled RigType: ${type} on ${char.Name}!`;
	}

	export function getRigEitherSync(player: Player) {
		return getRigEither(player).await()[1] as CharacterRigR15 | CharacterRigR6;
	}
}
