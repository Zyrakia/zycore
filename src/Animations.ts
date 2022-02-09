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
	export function extractId(animation: Animation | AnimationTrack) {
		const anim = animation.IsA('Animation') ? animation : animation.Animation;
		if (!anim) return;

		const stringId = Strings.extractNumbers(anim.AnimationId);
		return tonumber(stringId);
	}

	/**
	 * Iterates through all running tracks, stops each track, destroys it's animation and
	 * then destroys the track itself.
	 *
	 * @param animator The animator to clear.
	 */
	export function resetAnimator(animator: Animator) {
		const tracks = animator.GetPlayingAnimationTracks();
		tracks.forEach((track) => {
			track.Stop();
			track.Animation?.Destroy();
			track.Destroy();
		});
	}
}
