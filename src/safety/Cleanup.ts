export type CleanableValue =
	| (() => unknown)
	| { destroy(): void }
	| { Destroy(): void }
	| { cancel(): void }
	| { Cancel(): void }
	| { disconnect(): void }
	| { Disconnect(): void };

export function cleanup<T extends CleanableValue>(value: T) {
	if (typeIs(value, 'function')) value();
	else if ('Disconnect' in value) value.Disconnect();
	else if ('disconnect' in value) value.disconnect();
	else if ('Destroy' in value) value.Destroy();
	else if ('destroy' in value) value.destroy();
	else if ('Cancel' in value) value.Cancel();
	else if ('cancel' in value) value.cancel();
}

export function cleanupAll(...values: CleanableValue[]) {
	for (const value of values) cleanup(value);
}
