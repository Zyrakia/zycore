import { Workspace } from '@rbxts/services';

export namespace Raycasts {
	/**
	 * Fires a raycast from the given origin in the given direction.
	 *
	 * @param origin The origin of the raycast
	 * @param direction The direction of the raycast
	 * @param params The parameters of the raycast
	 * @returns The raycast result
	 */
	export function fire(origin: Vector3, direction: Vector3, params?: RaycastParams) {
        return Workspace.Raycast(origin, direction, params);
	}

	/**
	 * Repeatedly fires a raycast from the given origin in the given direction. Each
	 * hit is then passed to the given filter function. If the filter function returns
	 * true, another raycast will be fired, but with params containing the previous hit
	 * as part of the filter. If it return false, the result will be returned.
	 *
	 * @param origin The origin of the raycast
	 * @param direction The direction of the raycast
	 * @param filterFunction The filter function
	 * @param params The parameters of the raycast
	 * @returns The raycast result
	 */
	export function rapidFire(
		origin: Vector3,
		direction: Vector3,
		filterFunction: (hit: RaycastResult) => boolean,
		params = new RaycastParams(),
	) {
		let result: RaycastResult | undefined;

		while (true) {
			const hit = fire(origin, direction, params);
			if (!hit) break;

			if (filterFunction(hit)) {
				params.FilterDescendantsInstances = [...params.FilterDescendantsInstances, hit.Instance];
				continue;
			}

			result = hit;
			break;
		}

		return result;
	}
}
