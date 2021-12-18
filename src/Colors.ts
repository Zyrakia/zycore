export namespace Colors {
	/**
	 * Returns a color form the give RGB values.
	 */
	export function RGB(r: number, g: number, b: number) {
		return Color3.fromRGB(r, g, b);
	}

	/**
	 * Returns a random color.
	 */
	export function random(random = new Random()) {
		return RGB(random.NextNumber(0, 255), random.NextNumber(0, 255), random.NextNumber(0, 255));
	}

	/**
	 * Returns the given list of colors evenly spread out into a ColorSequence.
	 *
	 * @param colors The list of colors to spread out.
	 * @returns The spread out list of colors.
	 */
	export function sequence(...colors: Color3[]) {
		const size = colors.size();
		if (size === 0) return new ColorSequence(WHITE);
		else if (size === 1) return new ColorSequence(colors[0]);

		const keypoints: ColorSequenceKeypoint[] = [];

		const timeSpacing = 1 / (size - 1);

		let i = 0;
		for (const color of colors) {
			const time = timeSpacing * i++;
			keypoints.push(new ColorSequenceKeypoint(time, color));
		}

		return new ColorSequence(keypoints);
	}

	export const WHITE = RGB(255, 255, 255);
	export const BLACK = RGB(0, 0, 0);
	export const RED = RGB(255, 0, 0);
	export const GREEN = RGB(0, 255, 0);
	export const BLUE = RGB(0, 0, 255);
	export const YELLOW = RGB(255, 255, 0);
	export const CYAN = RGB(0, 255, 255);
	export const MAGENTA = RGB(255, 0, 255);
	export const ORANGE = RGB(255, 128, 0);
	export const BROWN = RGB(128, 64, 0);
	export const PURPLE = RGB(128, 0, 128);
	export const PINK = RGB(255, 192, 203);
	export const LIME = RGB(0, 255, 0);
	export const TEAL = RGB(0, 128, 128);
	export const SALMON = RGB(250, 128, 114);
	export const MAROON = RGB(128, 0, 0);
	export const OLIVE = RGB(128, 128, 0);
	export const NAVY = RGB(0, 0, 128);
	export const AQUA = RGB(0, 255, 255);
	export const GRAY = RGB(128, 128, 128);
}

export const RGB = Colors.RGB;
