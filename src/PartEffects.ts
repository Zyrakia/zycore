import { Clone } from '@rbxts/altmake';
import { TweenService } from '@rbxts/services';
import { Colors } from 'Colors';
import { thanosParticles } from 'instance-presets/thanosParticles';
import { Numbers } from 'Numbers';

export namespace PartEffects {
	/**
	 * Sinks a BasePart while fading it out until it is fully
	 * under y-0. The speed of the sinking is determined by the
	 * distance between the part and the y-0 plane, divided
	 * by the sinkSpeed parameter.
	 *
	 * @param part The part to sink.
	 * @param sinkSpeed The speed at which the part sinks.
	 * @returns A promise that resolves when the part is sunk completely.
	 */
	export function sink(part: BasePart, sinkSpeed: number) {
		return new Promise<void>((resolve) => {
			const currentPos = part.Position.Y;
			const targetPos = part.Position.mul(new Vector3(1, 0, 1)).add(new Vector3(0, 0 - part.Size.Y, 0));
			const difference = math.max(0, targetPos.Y - currentPos);

			const duration = math.max(0.5, difference / sinkSpeed);
			const info = new TweenInfo(duration, Enum.EasingStyle.Linear);
			const tween = TweenService.Create(part, info, { Position: targetPos, Transparency: 1 });

			tween.Completed.Connect(() => {
				tween.Destroy();
				resolve();
			});

			tween.Play();
		});
	}

	/**
	 * Adds thanos particles to a part and fades it out
	 * throughout the specified duration.
	 *
	 * @param part The part to fade out.
	 * @param duration The duration during it should be faded out.
	 * @param delay The delay between creating the particles, and starting the fade. (Defaults to 0).
	 * @returns A promise that resolves when the fading is complete.
	 */
	export function thanos(part: BasePart, duration: number, delay = 0) {
		return new Promise<void>((resolve) => {
			const particles = Clone(thanosParticles, {
				Color: Colors.sequence(part.Color, Colors.BLACK),
				Parent: part,
			});

			const info = new TweenInfo(duration, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut);
			const partTween = TweenService.Create(part, info, { Transparency: 1 });
			const sequenceTween = Numbers.sequenceTween(
				particles.Transparency.Keypoints[0].Value,
				1,
				info,
				(transparency) => (particles.Transparency = transparency),
			);

			partTween.Completed.Connect(() => {
				sequenceTween.Destroy();
				partTween.Destroy();
				particles.Destroy();
				resolve();
			});

			task.wait(delay);

			partTween.Play();
			sequenceTween.Play();
		});
	}
}
