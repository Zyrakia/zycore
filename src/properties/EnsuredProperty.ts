/**
 * A helper class to ensure a property on an instance
 * always equals a certain value.
 *
 * When the property updates it will automatically
 * set it back to the ensured value. If not careful,
 * this can create frequent updates. Especially if
 * two ensured properties are linked ot the same
 * property on the same instance... don't do that.
 */
export class EnsuredProperty<T extends Instance, K extends keyof WritableInstanceProperties<T>> {
	/** The connection watching the specified property. */
	private updateConnection?: RBXScriptConnection;

	/** The initial value of the property. */
	private initialValue: T[K];

	/**
	 * Constructs a new ensured property with the givne instance,
	 * property key and value.
	 *
	 * This will update the property if it is not already at the
	 * ensured value.
	 *
	 * @param inst The instance to connect to.
	 * @param key The property key of the value to ensure.
	 * @param ensuredValue The value to ensure at the specified property key.
	 */
	public constructor(private inst: T, private key: K, private ensuredValue: T[K]) {
		this.initialValue = this.inst[this.key];
		this.update();

		const signal = this.inst.GetPropertyChangedSignal(key);
		this.updateConnection = signal.Connect(() => this.update());
	}

	/**
	 * Updates the property on the instance if it is not already
	 * at the wanted value.
	 */
	private update() {
		if (this.inst[this.key] === this.ensuredValue) return;
		this.inst[this.key] = this.ensuredValue;
	}

	/**
	 * Returns the current value of the specified
	 * property on the specified instance.
	 */
	public get() {
		return this.inst[this.key];
	}

	/**
	 * Updates the ensured value of this ensured property.
	 * This will update the property on the instance
	 * if necessary.
	 */
	public set(value: T[K]) {
		this.ensuredValue = value;
		this.update();
	}

	/**
	 * Returns the inital that was recorded when the
	 * ensured property was constructed.
	 */
	public getInitial() {
		return this.initialValue;
	}

	/**
	 * Disconnects the automatic update connection,
	 * stopping any future updates.
	 *
	 * @param reset If true, sets the value back to the initial value, defaults to true.
	 */
	public destroy(reset = true) {
		if (this.updateConnection) {
			this.updateConnection.Disconnect();
			this.updateConnection = undefined;
		}

		if (reset) this.inst[this.key] = this.initialValue;
	}
}
