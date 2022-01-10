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

/**
 * A map to possible rbxthumb asset types
 * mapped to their possible height and width
 * values.
 */
export interface ThumbnailTypes {
	Asset: 150 | 420;
	Avatar: 100 | 352 | 720;
	AvatarHeadShot: 48 | 60 | 150;
	BadgeIcon: 150;
	BundleThumbnail: 150 | 420;
	GameIcon: 50 | 150;
	GamePass: 150;
	GroupIcon: 150 | 420;
	Outfit: 150 | 420;
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
	 * Returns the assetId number encoded in the Roblox thumbnail
	 * protocol `rbxthumb://`, with the given asset type and dimensions.
	 *
	 * This `thumbnail(24813339, "Asset", 150)`
	 * turns into this `rbxthumb://type=Asset&id=24813339&w=150&h=150`
	 *
	 * To read more about the rbxthumb protocol, see
	 * [here](https://developer.roblox.com/en-us/articles/Content#rbxthumb).
	 *
	 * @param assetId The assetId to prefix.
	 * @param typeName The type of thumbnail to use.
	 * @param size The size of the thumbnail. (used for width and height)
	 * @returns The assetId encoded into a thumbnail URL.
	 */
	export function thumbnail<T extends keyof ThumbnailTypes>(
		assetId: number,
		typeName: T,
		size: ThumbnailTypes[T],
	) {
		return `rbxthumb://type=${typeName}&id=${assetId}&w=${size}&h=${size}`;
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
	 * @param assetType The type of instance to create.
	 * @returns The created instance.
	 */
	export function preloadCreate(assetId: string, assetType: PreloadableAsset) {
		let instance: Instance;

		switch (assetType) {
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
	export function preloadReturn<T extends Instance>(instance: T) {
		preload(instance);
		return instance;
	}
}
