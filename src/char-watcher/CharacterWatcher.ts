import { Bin } from '@rbxts/bin';
import { Ping } from '@rbxts/ping';

export class CharacterWatcher {
	private isDestroyed = false;
	private bin = new Bin();

	private addedPing = new Ping<[char: Model]>();

	/** A ping that fires every time the players character is added. */
	public readonly onAdded = this.addedPing.connector;

	private removingPing = new Ping<[char: Model]>();

	/** A ping that fires every time the players character is removing. */
	public readonly onRemoving = this.removingPing.connector;

	/**
	 * Constructs a new CharacterWatcher tied to the given player.
	 * In order to start watching the player, call {@link watch}.
	 *
	 * Before calling watch, you should connect to the pings
	 * you need to listen to since watch will fire for the
	 * existing character immediately if desired.
	 *
	 * @param player The player to watch
	 * @param existing Whether to fire for an existing character
	 */
	public constructor(private player: Player, private existing = true) {}

	/**
	 * Start watching the player for character events, and
	 * fire for the existing character if desired.
	 */
	public watch() {
		this.linkTo(this.player);
	}

	/**
	 * Sets the player this watcher is watching,
	 * this will clear all connections relating to
	 * the previous player and create new ones for
	 * the specified player.
	 *
	 * This will fire for existing characters if desired, there is
	 * no need to call {@link watch} again, this will do the
	 * same thing.
	 *
	 * This will do nothing if the player is already being watched.
	 *
	 * @param player The player to watch
	 */
	public setPlayer(player: Player) {
		if (player === this.player) return;
		this.bin.destroy();
		this.linkTo(player);
	}

	private linkTo(player: Player) {
		if (!this.bin.isEmpty()) return;
		if (this.isDestroyed) throw 'CharacterWatcher is destroyed.';
		this.player = player;

		const added = player.CharacterAdded.Connect((model) => this.added(model));
		const removing = player.CharacterRemoving.Connect((model) => this.removing(model));
		this.bin.add(added);
		this.bin.add(removing);

		if (this.existing) {
			const char = player.Character;
			if (char) this.added(char);
		}
	}

	/**
	 * Returns the player this watcher is currently watching.
	 */
	public getPlayer() {
		return this.player;
	}

	/**
	 * Called whenever the player's character is added.
	 */
	private async added(char: Model) {
		this.addedPing.fire(char);
	}

	/**
	 * Called whenever the player's character is removing.
	 */
	private async removing(char: Model) {
		this.removingPing.fire(char);
	}

	/**
	 * Destroys the watcher,including
	 * all internal event connections
	 * and ping connections.
	 *
	 * This will make the watcher unusable and
	 * throw if asked to watch again.
	 */
	public destroy() {
		if (this.isDestroyed) return;
		this.isDestroyed = true;
		this.bin.destroy();
		this.addedPing.destroy();
		this.removingPing.destroy();
	}
}
