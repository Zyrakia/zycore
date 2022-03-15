export const R15Members = {
	Head: 'BasePart',
	LeftFoot: 'BasePart',
	LeftHand: 'BasePart',
	LeftLowerArm: 'BasePart',
	LeftLowerLeg: 'BasePart',
	LeftUpperArm: 'BasePart',
	LeftUpperLeg: 'BasePart',
	LowerTorso: 'BasePart',
	RightFoot: 'BasePart',
	RightHand: 'BasePart',
	RightLowerArm: 'BasePart',
	RightLowerLeg: 'BasePart',
	RightUpperArm: 'BasePart',
	RightUpperLeg: 'BasePart',
	UpperTorso: 'BasePart',
	HumanoidRootPart: 'BasePart',
	Humanoid: 'Humanoid',
} as const;

export const R15MemberNames = [
	'Head',
	'LeftFoot',
	'LeftHand',
	'LeftLowerArm',
	'LeftLowerLeg',
	'LeftUpperArm',
	'LeftUpperLeg',
	'LowerTorso',
	'RightFoot',
	'RightHand',
	'RightLowerArm',
	'RightLowerLeg',
	'RightUpperArm',
	'RightUpperLeg',
	'UpperTorso',
	'HumanoidRootPart',
	'Humanoid',
] as ReadonlyArray<string>;

export const CharacterSounds = {
	Climbing: 'Climbing',
	Died: 'Died',
	FreeFalling: 'FreeFalling',
	GettingUp: 'GettingUp',
	Jumping: 'Jumping',
	Landing: 'Landing',
	Running: 'Running',
	Splash: 'Splash',
	Swimming: 'Swimming',
};

export namespace Character {
	/**
	 * Returns the character model of the player.
	 *
	 * @param player The player to get the character model of.
	 * @returns The character model of the player.
	 */
	export function get(player: Player) {
		return player.Character || player.CharacterAdded.Wait()[0];
	}

	/**
	 * Returns the character model of the player.
	 *
	 * @param player The player to get the character model of.
	 * @returns A promise that resolves with the character model of the player.
	 */
	export function getAsync(player: Player) {
		return player.Character || Promise.fromEvent(player.CharacterAdded);
	}

	/**
	 * Returns the specified member of the specified model,
	 * the specified member will exist if the model is a character, but
	 * it is still important to check if this function returns undefined.
	 *
	 * @param char The character model.
	 * @param member The member to get.
	 * @returns The specified member of the model.
	 */
	export function getMember<T extends keyof typeof R15Members>(char: Model, member: T) {
		const found = char.FindFirstChild(member);
		if (!found?.IsA(R15Members[member])) return;
		return found;
	}

	/**
	 * Yields for the specified member of the specified model,
	 * the specified member will exist if the model is a character, but
	 * it is still important to check if this function returns undefined.
	 *
	 * @param char The character model.
	 * @param member The member to get.
	 * @param timeout The timeout to wait for the specified member (defualts to 3 seconds).
	 */
	export function waitMember<T extends keyof typeof R15Members>(char: Model, member: T, timeout = 3) {
		const found = char.WaitForChild(member, timeout);
		if (!found?.IsA(R15Members[member])) return;
		return found;
	}

	/**
	 * Returns the specified sound of the specified model or HRP,
	 * if it is a model, it will try to find the HumanoidRootPart
	 * member automatically.
	 *
	 * @param charOrRoot The character model or HumanoidRootPart.
	 * @param sound The sound to get.
	 * @returns The specified sound, if it was found.
	 */
	export function getSound<T extends keyof typeof CharacterSounds>(
		charOrRoot: Model | BasePart,
		soundName: T,
	) {
		const part = charOrRoot.IsA('BasePart')
			? charOrRoot
			: Character.getMember(charOrRoot, 'HumanoidRootPart');

		if (!part) return;

		const sound = part.FindFirstChild(soundName);
		if (!sound?.IsA('Sound')) return;

		return sound;
	}

	/**
	 * Yields for the specified sound of the specified model or HRP,
	 * if it is a model, it will try to yield for the HumanoidRootPart
	 * member automatically.
	 *
	 * @param charOrRoot The character model or HumanoidRootPart.
	 * @param sound The sound to get.
	 * @param timeout The timeout to wait for the specified sound (defualts to 3 seconds).
	 * @returns The specified sound, if it was found.
	 */
	export function waitSound<T extends keyof typeof CharacterSounds>(
		charOrRoot: Model | BasePart,
		soundName: T,
		timeout = 3,
	) {
		const part = charOrRoot.IsA('BasePart')
			? charOrRoot
			: Character.waitMember(charOrRoot, 'HumanoidRootPart', timeout);

		if (!part) return;

		const sound = part.WaitForChild(soundName, timeout);
		if (!sound?.IsA('Sound')) return;

		return sound;
	}

	/**
	 * Returns the animator of the specified model,
	 * this will exist if the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model, can also be a humanoid directly.
	 * @returns The animator of the model.
	 */
	export function getAnimator(char: Model | Humanoid) {
		const hum = char.IsA('Humanoid') ? char : getMember(char, 'Humanoid');
		if (!hum) return;

		const animator = hum.FindFirstChildOfClass('Animator');
		if (animator) return animator;
	}

	/**
	 * Yields for the animator of the specified model,
	 * this will exist if the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model, can also be a humanoid directly.
	 * @param timeout The timeout to wait for the animator (defualts to 3 seconds).
	 * @returns The animator of the model.
	 */
	export function waitAnimator(char: Model | Humanoid, timeout = 3) {
		const hum = char.IsA('Humanoid') ? char : waitMember(char, 'Humanoid', timeout);
		if (!hum) return;

		const animator = hum.WaitForChild('Animator', timeout);
		if (!animator?.IsA('Animator')) return;
		return animator;
	}

	/**
	 * Ensures a humanoid is standing.
	 * Useful when teleporting a player so the seat
	 * doesn't follow the player.
	 *
	 * To prevent any weirdness, this function will
	 * yield for a maximum of 0.3 seconds, and disable the
	 * seat for a maximum of one second. This is required
	 * because there is a delay between the player standing up
	 * and the game actually updating the seat.
	 *
	 * If the humanoid is not sitting, this function will
	 * do nothing and not yield.
	 *
	 * @param char The char to ensure is standing, can also be a humanoid directly.
	 */
	export function stand(char: Model | Humanoid) {
		const hum = char.IsA('Humanoid') ? char : getMember(char, 'Humanoid');
		if (!hum || !hum.SeatPart) return;

		const seat = hum.SeatPart;
		if (!seat.IsA('Seat')) return;

		const originalDisabled = seat.Disabled;
		seat.Disabled = true;
		hum.Sit = false;
		task.wait(0.3);

		task.delay(1, () => (seat.Disabled = originalDisabled));
	}

	/**
	 * Teleports the characters primary part to the given position.
	 * If the model passed into this function is actually a character model,
	 * this will be the characters HumanoidRootPart.
	 *
	 * This could techniaclly be used with any model, but it is intended to be
	 * used with a character model.
	 *
	 * If the character just spawned, this will not work, you should
	 * wait for the GetPropertyChangedSignal("Position") signal on
	 * the HumanoidRootPart first.
	 *
	 * @param char The character to teleport.
	 * @param location The location to teleport to.
	 */
	export function teleport(char: Model, location: Vector3 | CFrame | BasePart) {
		if (typeIs(location, 'Vector3')) char.PivotTo(new CFrame(location));
		else if (typeIs(location, 'CFrame')) char.PivotTo(location);
		else char.PivotTo(location.CFrame);
	}

	/**
	 * Unequips any tools that the character may be holding,
	 * and returns the tool that was previously in the
	 * character, and was affected by the unequip.
	 *
	 * @param char The character to unequip tools from, can also be a humanoid directly.
	 * @returns The tool that was previously in the character, or undefined.
	 */
	export function forceUnequip(char: Model | Humanoid) {
		const hum = char.IsA('Model') ? getMember(char, 'Humanoid') : char;
		if (!hum) return;

		const tool = char.FindFirstChildOfClass('Tool');
		hum.UnequipTools();
		if (tool?.Parent !== char) return tool;
	}

	/**
	 * Returns the animation script within a character.
	 *
	 * @param char The character to get the animation script from.
	 * @returns The animation script, or undefined if it wasn't found.
	 */
	export function getAnimationScript(char: Model) {
		const animScript = char.FindFirstChild('Animate');
		if (!animScript?.IsA('LocalScript')) return;
		return animScript;
	}

	/**
	 * Searches through the character's animate script and finds the
	 * given animation for the specified state name and returns it.
	 *
	 * @param char The character to get the animation script from.
	 * @param state The state name to search for.
	 * @returns The animation, or undefined if it wasn't found.
	 */
	export function getAnimationForState(char: Model, state: string) {
		const animScript = getAnimationScript(char);
		if (!animScript) return;

		const container = animScript.FindFirstChild(state.lower());
		if (!container?.IsA('StringValue')) return;

		return container.FindFirstChildOfClass('Animation');
	}
}
