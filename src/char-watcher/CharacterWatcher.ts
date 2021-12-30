import { Bin } from '@rbxts/bin';
import { Ping } from '@rbxts/ping';

export class CharacterWatcher {
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
	 * @see {@link watch}
	 * @see {@link onAdded}
	 * @see {@link onRemoving}
	 *
	 * @param player The player to watch
	 * @param existing Whether to fire for an existing character
	 */
	public constructor(private player: Player, private existing = true) {
		this.bin.add(this.addedPing);
		this.bin.add(this.removingPing);
	}

	/**
	 * Start watching the player for character events, and
	 * fire for existing characters if desired.
	 */
	public watch() {
		if (this.bin.isEmpty()) throw 'CharacterWatcher is destroyed.';

		if (this.existing) {
			const char = this.player.Character;
			if (char) this.added(char);
		}

		const added = this.player.CharacterAdded.Connect((model) => this.added(model));
		const removing = this.player.CharacterRemoving.Connect((model) => this.removing(model));

		this.bin.add(added);
		this.bin.add(removing);
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
		this.bin.destroy();
	}
}
