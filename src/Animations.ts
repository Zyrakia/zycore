import { Strings } from 'Strings';

export namespace Animations {
	/**
	 * Extracts numbers from the specified animation or the animation
	 * in the specified animation track and returns it parsed as a number.
	 * This will not work for animations that have an animation ID property that
     * includes any numbers except the actual asset ID, since all it's doing
     * is extracting and parsing the numbers.
     * 
     * Example:
	 * ```ts
	 * const animation = new Instance("Animation");
	 * animation.AnimationId = "rbxassetid://1234"
	 * extractId(animation) -> 1234
	 * ```
	 *
	 * @param animation The animation to extract the number from.
	 * @returns The number extracted from the animation.
	 */
	export function extractId(animation: Animation | AnimationTrack): number | undefined {
		if (animation.IsA('Animation')) {
			const stringId = Strings.extractNumbers(animation.AnimationId);
			return tonumber(stringId);
		}

		const anim = animation.Animation;
		if (!anim) return;

		return extractId(anim);
	}
}
