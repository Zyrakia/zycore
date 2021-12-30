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
	 * Returns the humanoid of the specified model,
	 * this will exist if the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model.
	 * @returns The humanoid of the character model.
	 */
	export function getHum(char: Model) {
		return char.FindFirstChildOfClass('Humanoid');
	}

	/**
	 * Yields for the humanoid of the specified model,
	 * this will exist if the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model.
	 * @param timeout The timeout to wait for the humanoid (defualts to 3 seconds).
	 * @returns A promise that resolves with the humanoid of the character model.
	 */
	export function waitHum(char: Model, timeout = 3) {
		const humanoid = char.WaitForChild('Humanoid', timeout);
		if (humanoid?.IsA('Humanoid')) return humanoid;
	}

	/**
	 * Returns the HRP of the specified model,
	 * this will exist if the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model.
	 * @returns The HumanoidRootPart of the model.
	 */
	export function getRoot(char: Model) {
		const root = char.FindFirstChild('HumanoidRootPart');
		if (root?.IsA('BasePart')) return root;
	}

	/**
	 * Yields for the HRP of the specified model,
	 * this will exist of the model is a character, but
	 * it is still important to check if this function
	 * returns undefined.
	 *
	 * @param char The character model.
	 * @param timeout The timeout to wait for the HRP (defualts to 3 seconds).
	 * @returns The HumanoidRootPart of the model.
	 */
	export function waitRoot(char: Model, timeout = 3) {
		const root = char.WaitForChild('HumanoidRootPart', timeout);
		if (root?.IsA('BasePart')) return root;
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
		const hum = char.IsA('Humanoid') ? char : getHum(char);
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
		const hum = char.IsA('Humanoid') ? char : waitHum(char, timeout);
		if (!hum?.IsA('Humanoid')) return;

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
		const hum = char.IsA('Humanoid') ? char : getHum(char);
		if (!hum?.IsA('Humanoid')) return;

		if (!hum.SeatPart) return;

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
		if (typeIs(location, 'Vector3')) char.SetPrimaryPartCFrame(new CFrame(location));
		else if (typeIs(location, 'CFrame')) char.SetPrimaryPartCFrame(location);
		else char.SetPrimaryPartCFrame(location.CFrame);
	}
}
