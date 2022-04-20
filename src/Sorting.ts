/** Declaration for a sorting function, returns true to switch elements, false to do nothing. */
export type SF = (a: number, b: number) => boolean;

/** Preset for an ascending sorting function. (`a < b`) */
export const SF_ASCENDING: SF = (a, b) => a < b;

/** Preset for a descending sorting function. (`a > b`) */
export const SF_DESCENDING: SF = (a, b) => a > b;

export namespace Sorting {
	/**
	 * Sorts each element in the array by comparing
	 * the value at the specified property with the
	 * specified sort function.
	 *
	 * @param entries The entries to sort.
	 * @param property The property of the value to use for comparison.
	 * @param sortFunction The sorting function to use, defaults to {@link SF_ASCENDING}.
	 * @returns The sorted entries.
	 */
	export function sortByProperty<T extends defined>(
		entries: T[],
		property: { [K in keyof T]: T[K] extends number ? K : never }[keyof T],
		sortFunction = SF_ASCENDING,
	) {
		return entries.sort((a, b) => {
			const aProperty = a[property] as unknown as number;
			const bProperty = b[property] as unknown as number;
			return sortFunction(aProperty, bProperty);
		});
	}

	/**
	 * Sorts the specified entries with the specified sort
	 * function, but for each comparison it calls the map function
	 * and uses the result of that function for the comparison.
	 *
	 * @param entries The entries to sort.
	 * @param mapFunction The function to map each element with.
	 * @param sortFunction The sorting function to use, defaults to {@link SF_ASCENDING}.
	 */
	export function mapSort<T extends defined>(
		entries: T[],
		mapFunction: (entry: T) => number,
		sortFunction = SF_ASCENDING,
	) {
		return entries.sort((a, b) => {
			const aResolved = mapFunction(a);
			const bResolved = mapFunction(b);
			return sortFunction(aResolved, bResolved);
		});
	}

	/**
	 * Sorts the specified entries by their position vector. If an axis
	 * is specified it uses the value at that axis for the sort, otherwise
	 * it uses the magnitude of the positional vector.
	 *
	 * @param entries The positional entries to sort.
	 * @param axis The axis to sort with, omit to sort with magnitude.
	 * @param sortFunction The sort function to use, defaults to {@link SF_ASCENDING}.
	 */
	export function sortByPosition<T extends { Position: Vector3 }>(
		entries: T[],
		axis?: 'X' | 'Y' | 'Z',
		sortFunction = SF_ASCENDING,
	) {
		const specifiedAxis = axis !== undefined;
		return entries.sort((a, b) => {
			const aResolved = specifiedAxis ? a.Position[axis] : a.Position.Magnitude;
			const bResolved = specifiedAxis ? b.Position[axis] : b.Position.Magnitude;
			return sortFunction(aResolved, bResolved);
		});
	}
}
