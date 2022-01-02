import { Make } from '@rbxts/altmake';
import { Ping } from '@rbxts/ping';
import { ContentProvider } from '@rbxts/services';

/**
 * All the current asset types that
 * are preloadable by the {@link Asset.preloadCreate}
 * function.
 */
export enum PreloadableAsset {
	DECAL,
	SOUND,
	ANIMATION,
}

export namespace Asset {
	/**
	 * Prefixes an assetId number with the Roblox asset
	 * protocol `rbxassetid://`.
	 *
	 * @param assetId The assetId to prefix.
	 * @returns The prefixed assetId.
	 */
	export function prefix(assetId: number) {
		return `rbxassetid://${assetId}`;
	}

	/**
	 * Passes all passed instances to the ContentProvider,
	 * and returns a ping that fires whenever an instance
	 * is processed, the ping will include the content ID of the
	 * asset and it's preload result. It will also for
	 * convenience include the remaining queue length
	 * of the ContentProvider.
	 *
	 * After all instances are processed, the ping will
	 * automatically be destroyed.
	 *
	 * @param instances The instances to preload.
	 * @returns A ping that fires whenever an instance is processed.
	 */
	export function preload(...instances: Instance[]) {
		const ping = new Ping<[id: string, status: Enum.AssetFetchStatus, remaining: number]>();

		task.spawn(() => {
			ContentProvider.PreloadAsync(instances, (id, status) => {
				const remaining = ContentProvider.RequestQueueSize;
				ping.fire(id, status, remaining);
			});

			ping.destroy();
		});

		return ping.connector;
	}

	/**
	 * Sends all passed instances to the ContentProvider,
	 * and returns a promise that contains two arrays of
	 * all content IDs that succeded and failed.
	 *
	 * @param instances The instances to preload.
	 * @returns A promise that contains the results of the preload.
	 */
	export function preloadPromise(...instances: Instance[]) {
		return new Promise<[succeded: string[], fails: string[]]>((resolve) => {
			const succeeded: string[] = [];
			const fails: string[] = [];

			ContentProvider.PreloadAsync(instances, (id, status) => {
				if (status === Enum.AssetFetchStatus.Success) {
					succeeded.push(id);
				} else fails.push(id);
			});

			resolve([succeeded, fails]);
		});
	}

	/**
	 * Attempts to preload the given asset ID by creating
	 * an instance of the specified type and using the
	 * {@link preload} function. Returns the instance
	 * that was created.
	 *
	 * @param assetId The asset ID to preload.
	 * @param type The type of instance to create.
	 * @returns The created instance.
	 */
	export function preloadCreate(assetId: string, type: PreloadableAsset) {
		let instance: Instance;

		switch (type) {
			case PreloadableAsset.DECAL:
				instance = Make('Decal', { Texture: assetId });
				break;
			case PreloadableAsset.SOUND:
				instance = Make('Sound', { SoundId: assetId });
				break;
			case PreloadableAsset.ANIMATION:
				instance = Make('Animation', { AnimationId: assetId });
				break;
		}

		preload(instance);
		return instance;
	}

	/**
	 * Passes the given instance to the ContentProvider,
	 * and returns it.
	 *
	 * @param instance The instance to preload.
	 * @returns The instance.
	 */
	export function preloadReturn(instance: Instance) {
		preload(instance);
		return instance;
	}
}
