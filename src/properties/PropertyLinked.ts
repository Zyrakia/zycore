import { Bin } from '@rbxts/bin';

type LinkableProperties<I extends Instance> = keyof InstanceProperties<I> | keyof InstanceEvents<I>;

export abstract class PropertyLinked<I extends Instance, T> {
	/** Holds all the created connections. */
	protected bin = new Bin();

	/** The initial value of this holder. */
	protected readonly initialValue: T;

	/** The current value of this holder. */
	protected currentValue: T;

	/**
	 * Constructs a new PropertyLinked object linked to the
	 * specified instance and properties of that instance.
	 */
	public constructor(
		protected readonly inst: I,
		protected readonly linkedProperties: LinkableProperties<I>[],
	) {
		this.initialValue = this.update();
		this.currentValue = this.initialValue;
		this.connect();
	}

	/**
	 * Creates a list of linkable properties of the specified instance.
	 * This is a type utility to avoid having to write out the long winded type
	 * of all events and properties.
	 *
	 * @param props A list of properties to link to.
	 * @returns The list of the passed in properties.
	 */
	public static propsOf<I extends Instance>(...props: LinkableProperties<I>[]) {
		return props;
	}

	/**
	 * Connects to all of the linked properties.
	 * If the property is a signal, it connects to it directly,
	 * otherwise it will connect to the change of that
	 * property.
	 */
	private connect() {
		for (const prop of this.linkedProperties) {
			const value = this.inst[prop];
			if (typeIs(value, 'RBXScriptSignal')) {
				this.bin.add(value.Connect(() => this._update()));
				continue;
			}

			const signal = this.inst.GetPropertyChangedSignal(prop as keyof InstanceProperties<I>);
			this.bin.add(signal.Connect(() => this._update()));
		}
	}

	/**
	 * Sets the current value to the value returned
	 * by the subclass implementation.
	 */
	private _update() {
		this.currentValue = this.update();
	}

	/**
	 * Called when any of the linked properties update or fire.
	 * Should return the new current value.
	 */
	protected abstract update(): T;

	/**
	 * Returns the current value.
	 */
	public get() {
		return this.currentValue;
	}

	/**
	 * Returns the initial value.
	 */
	public getInitial() {
		return this.initialValue;
	}

	/**
	 * Destroys this property linked object, removing all connections,
	 * therefore preventing any further updates on the stored properties.
	 */
	public destroy() {
		this.bin.destroy();
	}
}
