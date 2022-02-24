export type CleanableValue =
	| (() => unknown)
	| { destroy(): void }
	| { Destroy(): void }
	| { disconnect(): void }
	| { Disconnect(): void }
	| { cancel(): void }
	| { Cancel(): void }
	| CleanableValue[];

export function cleanup<T extends CleanableValue>(value: T) {
	if (typeIs(value, 'RBXScriptConnection')) value.Disconnect();
	else if (typeIs(value, 'Instance')) value.Destroy();
	else if (typeIs(value, 'function')) value();
	else if ('destroy' in value) value.destroy();
	else if ('Destroy' in value) value.Destroy();
	else if ('disconnect' in value) value.disconnect();
	else if ('Disconnect' in value) value.Disconnect();
	else if ('cancel' in value) value.cancel();
	else if ('Cancel' in value) value.Cancel();
	else value.forEach((v) => cleanup(v));
}
