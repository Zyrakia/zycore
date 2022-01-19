import { Make } from '@rbxts/altmake';

interface SupportedConstraints {
	RigidConstraint: RigidConstraint;
	CylindricalConstraint: CylindricalConstraint;
	SpringConstraint: SpringConstraint;
	RodConstraint: RodConstraint;
	RopeConstraint: RopeConstraint;
	HingeConstraint: HingeConstraint;
	BallSocketConstraint: BallSocketConstraint;
}

export namespace Constraints {
	/**
	 * Creates two attachments parented to the specified instances.
	 * The host instance will contain the first attachment, and the
	 * target will contain the second attachment.
	 *
	 * @param host The instance to parent the first attachment to.
	 * @param target The instance to parent the second attachment to.
	 * @returns The attachments created.
	 */
	export function makeAttachments(host: Instance, target: Instance) {
		const a0 = Make('Attachment', { Parent: host });
		const a1 = Make('Attachment', { Parent: target });
		return { a0, a1 };
	}

	/**
	 * Creates an attachment in each of the two specified instances,
	 * and joins them together with a constraint of the specified type
	 * created in the host.
	 *
	 * @param className The type of constraint to create.
	 * @param host The instance to parent the attachment to.
	 * @param target The instance to parent the attachment to.
	 * @returns The attachments and constraint created.
	 */
	export function make(className: keyof SupportedConstraints, host: Instance, target: Instance) {
		const { a0, a1 } = makeAttachments(host, target);

		const constraint = Make(className, {
			Attachment0: a0,
			Attachment1: a1,
			Parent: host,
		});

		return { constraint, a0, a1 };
	}
}
