export type CleanableValue =
	| undefined
	| (() => unknown)
	| { destroy(): void }
	| { Destroy(): void }
	| { disconnect(): void }
	| { Disconnect(): void }
	| { cancel(): void }
	| { Cancel(): void }
	| { get(): CleanableValue }
	| Exclude<CleanableValue, undefined>[];

export function cleanup<T extends CleanableValue>(value: T) {
	if (value === undefined) return;

	if (typeIs(value, 'RBXScriptConnection')) value.Disconnect();
	else if (typeIs(value, 'Instance')) value.Destroy();
	else if (typeIs(value, 'function')) value();
	else if ('destroy' in value) value.destroy();
	else if ('Destroy' in value) value.Destroy();
	else if ('disconnect' in value) value.disconnect();
	else if ('Disconnect' in value) value.Disconnect();
	else if ('cancel' in value) value.cancel();
	else if ('Cancel' in value) value.Cancel();
	else if ('get' in value) cleanup(value.get());
	else value.forEach((v) => cleanup(v));
}
