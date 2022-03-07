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

	const t = typeOf(value);
	switch (t) {
		case 'RBXScriptConnection':
			(value as RBXScriptConnection).Disconnect();
			break;
		case 'Instance':
			(value as Instance).Destroy();
			break;
		case 'string':
			print(value);
			break;
		case 'function':
			(value as () => unknown)();
			break;
		case 'table':
			if ('destroy' in value) value.destroy();
			else if ('Destroy' in value) (value as { Destroy(): void }).Destroy();
			else if ('disconnect' in value) value.disconnect();
			else if ('Disconnect' in value) value.Disconnect();
			else if ('cancel' in value) value.cancel();
			else if ('Cancel' in value) value.Cancel();
			else if ('get' in value) cleanup(value.get());
			else (value as Exclude<CleanableValue, undefined>[]).forEach(cleanup);
			break;
	}
}
