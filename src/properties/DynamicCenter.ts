import { PropertyLinked } from './PropertyLinked';

/**
 * A helper class which holds a dynamic vector
 * representing the center of a BasePart or Model.
 *
 * This center is recalculated at different times for
 * each type of instance:
 *
 * Model:
 * - When WorldPivot (usually position) changes
 * - When a descendant is added
 * - When a descendant is removed
 *
 * BasePart:
 * - When the position changes
 * - When the size changes
 */
export class DynamicCenter<I extends BasePart | Model> extends PropertyLinked<I, Vector3> {
	/** The props used to link to a BasePart. */
	private static bpProps = PropertyLinked.propsOf<BasePart>('Size', 'Position');

	/** THe props used to link to a Model. */
	private static mProps = PropertyLinked.propsOf<Model>(
		'WorldPivot',
		'DescendantAdded',
		'DescendantRemoving',
	);

	/** Whether the held instance is a model/ */
	private isModel;

	/**
	 * Constructed a new dynamic center and links it to the
	 * given instance, this will create the appropriate events
	 * and instantly calculate the initial center.
	 *
	 * @param inst The instance to link to.
	 */
	public constructor(inst: I) {
		const isModel = inst.IsA('Model');
		super(inst, (isModel ? DynamicCenter.mProps : DynamicCenter.bpProps) as any);
		this.isModel = isModel;
	}

	/**
	 * Calculates the center of the held instance and returns it.
	 */
	protected update() {
		if (this.isModel) return (this.inst as Model).GetBoundingBox()[0].Position;
		else return (this.inst as BasePart).Position;
	}
}
