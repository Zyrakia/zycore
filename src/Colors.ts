export namespace Colors {
	/**
	 * Returns a color form the give RGB values.
	 */
	export function RGB(r: number, g: number, b: number) {
		return Color3.fromRGB(r, g, b);
	}

    /**
     * Returns a color from the given decimal hex value.
     * 
	 * From https://github.com/grilme99/tabletop-island/blob/main/src/shared/util/color-utils.ts
     * 
     * @param decimal The decimal hex value.
     * @returns The color.
     */
	export function fromHex(decimal: number) {
		return RGB(
			bit32.band(bit32.rshift(decimal, 16), 2 ** 8 - 1),
			bit32.band(bit32.rshift(decimal, 8), 2 ** 8 - 1),
			bit32.band(decimal, 2 ** 8 - 1),
		);
	}

	/**
	 * Encodes the given color to a string that can be used in a
	 * rich text enabled location.
	 *
	 * From https://github.com/grilme99/tabletop-island/blob/main/src/shared/util/color-utils.ts
	 *
	 * @param color The color to encode.
	 * @returns The encoded color.
	 */
	export function toRichText(color: Color3) {
		return `rgb(${math.round(color.R * 255)}, ${math.round(color.G * 255)}, ${math.round(color.B * 255)})`;
	}

	/**
	 * Returns the input color darkened by the given percentage.
	 *
	 * @param color The color to darken.
	 * @param perc The percentage to darken the color by.
	 *
	 */
	export function darken(color: Color3, perc: number) {
		return new Color3(color.R * perc, color.G * perc, color.B * perc);
	}

	/**
	 * Returns the input color lightened by the given percentage.
	 *
	 * @param color The color to lighten.
	 * @param perc The percentage to lighten the color by.
	 */
	export function lighten(color: Color3, perc: number) {
		return new Color3(perc + (1 - perc) * color.R, perc + (1 - perc) * color.G, perc + (1 - perc) * color.B);
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
