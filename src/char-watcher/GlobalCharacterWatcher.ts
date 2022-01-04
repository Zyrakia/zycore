import { Bin } from '@rbxts/bin';
import { Ping } from '@rbxts/ping';
import { Players } from '@rbxts/services';
import { CharacterWatcher } from './CharacterWatcher';

export class GlobalCharacterWatcher {
	private bin = new Bin();
	private watchers = new Map<Player, CharacterWatcher>();

	private addedPing = new Ping<[owner: Player, char: Model]>();

	/** A ping that fires every time a character is added. */
	public readonly onAdded = this.addedPing.connector;

	private removingPing = new Ping<[owner: Player, char: Model]>();

	/** A ping that fires every time a character is removing. */
	public readonly onRemoving = this.removingPing.connector;

	/**
	 * Constructs a new GlobalCharacterWatcher. This replicate
	 * the functionality of {@link CharacterWatcher}, but for all
	 * current and future players. In order to start watching
	 * call {@link watch}.
	 *
	 * Before calling watch, you should connect to the pings
	 * you need to listen to since watch will fire for the
	 * existing character immediately if desired.
	 *
	 * @param existing Whether to fire for an existing character
	 */
	public constructor(private existing = true) {
		this.bin.add(() => this.watchers.forEach((_, p) => this.unregister(p)));
		this.bin.add(this.addedPing);
		this.bin.add(this.removingPing);
	}

	/**
	 * Starts watching for character events on all players.
	 * Fires for existing characters if desired.
	 */
	public watch() {
		if (this.bin.isEmpty()) throw 'GlobalCharacterWatcher is destroyed.';

		Players.GetPlayers().forEach((p) => this.register(p));

		const joined = Players.PlayerAdded.Connect((p) => this.register(p));
		const left = Players.PlayerRemoving.Connect((p) => this.unregister(p));

		this.bin.add(joined);
		this.bin.add(left);
	}

	/**
	 * Registers a watcher for the given player.
	 *
	 * @param player The player to register
	 */
	private register(player: Player) {
		if (this.watchers.has(player)) return;

		const watcher = new CharacterWatcher(player, this.existing);

		watcher.onAdded.connect((char) => this.added(player, char));
		watcher.onRemoving.connect((char) => this.removing(player, char));

		watcher.watch();
		this.watchers.set(player, watcher);
	}

	/**
	 * Unregisters and destroys the watcher for
	 * the given player.
	 *
	 * @param player The player to unregister
	 */
	private unregister(player: Player) {
		if (!this.watchers.has(player)) return;

		const watcher = this.watchers.get(player)!;
		watcher.destroy();
		this.watchers.delete(player);
	}

	/**
	 * Called whenever a player's character is added.wh
	 */
	private added(player: Player, char: Model) {
		this.addedPing.fire(player, char);
	}

	/**
	 * Called whenever a player's character is removing.
	 */
	private removing(player: Player, char: Model) {
		this.removingPing.fire(player, char);
	}

	/**
	 * Destroys the watcher, including
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
