export namespace Cam {
	/**
	 * Returns a camera CFrame that would contain the given extents if it was
	 * at the given FOV.
	 *
	 * @param fov The FOV of the camera.
	 * @param extentSize The extent size of the subject. (i.e. `model.GetExtentsSize()`)
	 * @param depthMultiplier A multiplier of how far the camera should be from the subject. Default is 1.
	 */
	export function getFitCFrame(fov: number, extentSize: Vector3, depthMultiplier = 1) {
		const maxAxis = math.max(extentSize.X, extentSize.Y, extentSize.Z);
		const distBack = (maxAxis / math.tan(math.rad(fov))) * depthMultiplier;
		return new CFrame(0, 0, maxAxis / 2 + distBack);
	}
}
