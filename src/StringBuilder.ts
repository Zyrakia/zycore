/** A utility class to build a string. */
export class StringBuilder {
	/** The internal built value. */
	private _value: string;

	/** Constructs a builder with the given init.. */
	public constructor(private init = '') {
		this._value = init;
	}

	/** Adds the value followed by a newline. */
	public add(value: string) {
		this._value += value;
		return this;
	}

	/** Adds the value followed by a newline. */
	public addLine(value: string, nls = 1) {
		this._value += value + '\n'.rep(nls);
		return this;
	}

	/** Adds the value followed by a tab. */
	public addTab(value: string, tabs = 1) {
		this._value += value + '\t'.rep(tabs);
		return this;
	}

	/** Sets the value to the given init, defaults to an empty string. */
	public reset() {
		this._value = this.init;
		return this;
	}

	/** Sets the value to an empty string. */
	public clear() {
		this._value = '';
		return this;
	}

	/** Returns the built value. */
	public value() {
		return this._value;
	}

	/** Returns the built value. */
	public toString() {
		return this._value;
	}
}
