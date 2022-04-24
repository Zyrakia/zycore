import { InstanceTree } from 'InstanceTree';

type Aggregator = (root: Instance, existing: ReadonlyArray<Instance>) => Instance[];
type Query<T extends Instance> = (inst: Instance) => inst is T;
type RQuery = (inst: Instance) => boolean;

/**
 * Utility for finding instances that match a specific
 * set of criteria.
 */
export class InstanceQuery<T extends Instance[] = [Instance]> {
	/** Aggregators that collect potential matches. */
	protected aggregators: Aggregator[] = [];

	/** Queries that instances have to pass. */
	protected queries: RQuery[] = [];

	/**
	 * Adds all of the roots descendants to the list of
	 * potential matches when a search begins.
	 */
	public searchDeep() {
		return this.addAggregator((root) => root.GetDescendants());
	}

	/**
	 * Adds all of the roots children to the list of
	 * potential matches when a search begins.
	 */
	public searchNear() {
		return this.addAggregator((root) => root.GetChildren());
	}

	/**
	 * Adds all of the roots ancestors to the list of
	 * potential matches when a search begins.
	 */
	public searchUp() {
		return this.addAggregator((root) => InstanceTree.gatherAncestors(root));
	}

	/**
	 * Adds the root itself to the list of potential matches
	 * when a search begins.
	 */
	public inclusive() {
		return this.addAggregator((root) => [root]);
	}

	/**
	 * When a search begins, goes through all of the existing
	 * potential matches, and adds the value of any `ObjectValue`
	 * instances found.
	 */
	public searchReferences() {
		return this.addAggregator((_, existing) => {
			const referenced = [];

			for (const inst of existing) {
				if (!inst.IsA('ObjectValue') || !inst.Value) continue;
				referenced.push(inst.Value);
			}

			return referenced;
		});
	}

	/**
	 * Adds a query that checks if the instance has the given name.
	 *
	 * @param rawName The name to check for.
	 * @param ignoreCase Whether or not to ignore case when comparing the name. Defaults to `false`.
	 */
	public ofName(rawName: string, ignoreCase = false) {
		const name = ignoreCase ? rawName.lower() : rawName;

		return this.expect((inst): inst is Instance => {
			return (ignoreCase ? inst.Name.lower() : inst.Name) === name;
		});
	}

	/**
	 * Adds a query that checks if the instance is of the given type.
	 *
	 * @param typeName The type to check for.
	 * @param exact Whether to check `ClassName` equality instead of `IsA`. Defaults to `false`.
	 */
	public ofType<R extends keyof Instances>(typeName: R, exact = false) {
		return this.expect((inst): inst is Instances[R] => {
			return exact ? classIs(inst, typeName) : inst.IsA(typeName);
		});
	}

	/**
	 * Adds the specified query to the list of queries that
	 * each find result must pass.
	 *
	 * @param query The query to add, must be a type predicate.
	 */
	public expect<R extends Instance>(query: Query<R>) {
		this.queries.push(query);
		return this as unknown as InstanceQuery<[...T, R]>;
	}

	/**
	 * Adds a specified query to the list of queries that
	 * each find result must pass. This differs from
	 * `expect` in that it will not add the type predicate
	 * to the class generic, and does not require the query
	 * to return a type predicate.
	 *
	 * @param query The query to add.
	 */
	public expectR(query: RQuery) {
		this.queries.push(query);
		return this;
	}

	/**
	 * Adds an aggregator that collects instances that
	 * will be passed through the list of queries when
	 * a search begins.
	 *
	 * @param aggregator The aggregator to add.
	 */
	public addAggregator(aggregator: Aggregator) {
		this.aggregators.push(aggregator);
		return this;
	}

	/**
	 * Adds the children of the root to the list
	 * of potential matches and then adds any
	 * references to the list of potential matches.
	 * `searchNear().searchReferences()`
	 */
	public defaults() {
		return this.searchNear().searchReferences();
	}

	/**
	 * Executes a new search with the added queries and aggregators.
	 *
	 * @param root The root of the search.
	 * @returns The result of the search.
	 */
	public find(root: Instance) {
		for (const inst of this.aggregateFromRoot(root)) {
			if (!this.queries.every((q) => q(inst))) continue;
			return inst as UnionToIntersection<T[number]>;
		}
	}

	/**
	 * Executes a new search with the added queries and aggregators.
	 * Instead of returning the first result, it continues
	 * until all potential matches have been exhausted.
	 *
	 * @param root The root of the search.
	 * @returns The result of the search.
	 */
	public findAll(root: Instance) {
		const matches = [];

		for (const inst of this.aggregateFromRoot(root)) {
			if (this.queries.every((q) => q(inst))) matches.push(inst);
		}

		return matches;
	}

	/**
	 * Collects all potential matches from the given
	 * root with all registered aggregators.
	 */
	private aggregateFromRoot(root: Instance) {
		const all = [];

		for (const aggregator of this.aggregators) {
			const result = aggregator(root, all);
			for (const r of result) all.push(r);
		}

		return all;
	}
}
