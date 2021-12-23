import { InstanceTree } from 'InstanceTree';

export = () => {
	const parent = new Instance('Part');
	const child = new Instance('MeshPart');
	const grandChild = new Instance('MeshPart');
	const greatGrandChild = new Instance('Model');

	child.Parent = parent;
	grandChild.Parent = child;
	greatGrandChild.Parent = grandChild;

	const childAmount = 1;
	const descendantsAmount = 3;
	const meshDescendantAmount = 2;
	const meshChildAmount = 1;
	const ancestorsAmount = 3;

	describe('walk', () => {
		it('should invoke the callback for every descendant', () => {
			let walked = 0;
			InstanceTree.walk(parent, () => walked++);
			expect(walked).to.equal(descendantsAmount);
		});
	});

	describe('walkInclusive', () => {
		it('should invoke the callback for every descendant, including root', () => {
			let walked = 0;
			InstanceTree.walkInclusive(parent, () => walked++);
			expect(walked).to.equal(descendantsAmount + 1);
		});
	});

	describe('walkNear', () => {
		it('should invoke the callback for every child', () => {
			let walked = 0;
			InstanceTree.walkNear(parent, () => walked++);
			expect(walked).to.equal(childAmount);
		});
	});

	describe('walkNearInclusive', () => {
		it('should invoke the callback for every child, including root', () => {
			let walked = 0;
			InstanceTree.walkNearInclusive(parent, () => walked++);
			expect(walked).to.equal(childAmount + 1);
		});
	});

	describe('walkFilter', () => {
		it('should invoke the callback for every descendant of the given type', () => {
			let walked = 0;
			InstanceTree.walkFilter(parent, 'MeshPart', () => walked++);
			expect(walked).to.equal(meshDescendantAmount);
		});
	});

	describe('walkFilterInclusive', () => {
		it('should invoke the callback for every descendant of the given type, including root', () => {
			let walked = 0;
			InstanceTree.walkFilterInclusive(parent, 'MeshPart', () => walked++);
			expect(walked).to.equal(meshDescendantAmount);
		});
	});

	describe('walkNearFilter', () => {
		it('should invoke the callback for every child of the given type', () => {
			let walked = 0;
			InstanceTree.walkNearFilter(parent, 'MeshPart', () => walked++);
			expect(walked).to.equal(meshChildAmount);
		});
	});

	describe('walkNearFilterInclusive', () => {
		it('should invoke the callback for every child of the given type, including root', () => {
			let walked = 0;
			InstanceTree.walkNearFilterInclusive(parent, 'MeshPart', () => walked++);
			expect(walked).to.equal(meshChildAmount);
		});
	});

	describe('gatherAncestors', () => {
		it('should return all ancestors of the given instance', () => {
			const ancestors = InstanceTree.gatherAncestors(greatGrandChild);
			expect(ancestors.size()).to.equal(ancestorsAmount);
		});
	});

	describe('findHighestAncestorNotOfClass', () => {
		it('should return the highest ancestor not of the given class', () => {
			const ancestor = InstanceTree.findHighestAncestorNotOfClass(
				greatGrandChild,
				'MeshPart',
			);

			expect(ancestor).to.equal(parent);
		});
	});

	describe('cloneUnlock', () => {
		it('should should set all descendants as archivable', () => {
			InstanceTree.cloneUnlock(parent);
			InstanceTree.walk(parent, (instance) => {
				expect(instance.Archivable).to.equal(true);
			});
		});
	});

	describe('cloneLock', () => {
		it('should should set all descendants as not archivable', () => {
			InstanceTree.cloneLock(parent);
			InstanceTree.walk(parent, (instance) => {
				expect(instance.Archivable).to.equal(false);
			});
		});
	});

	describe('onDestroying', () => {
		it('should invoke the callback for a destroyed instance', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			part.Parent = parent;

			let called = false;
			InstanceTree.onDestroying(part, () => (called = true));

			part.Destroy();
			expect(called).to.equal(true);
		});

		it('should not invoke the callback when parent is unset', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			part.Parent = parent;

			let called = false;
			const conn = InstanceTree.onDestroying(part, () => (called = true));

			part.Parent = undefined;
			expect(called).to.equal(false);
			conn.Disconnect();
		});
	});

	describe('onDeparented', () => {
		it('should invoke the callback for a destroyed instance', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			part.Parent = parent;

			let called = false;
			InstanceTree.onDeparented(part, () => (called = true));

			part.Parent = undefined;
			expect(called).to.equal(true);
		});

		it('should invoke the callback when parent is unset', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			part.Parent = parent;

			let called = false;
			const conn = InstanceTree.onDeparented(part, () => (called = true));

			part.Parent = undefined;
			expect(called).to.equal(true);
			conn.Disconnect();
		});
	});

	describe('findClassInChildren', () => {
		it('should return the first instance of the given type', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			part.Parent = parent;

			const found = InstanceTree.findClassInChildren(parent, 'Part');
			expect(found).to.equal(part);
		});

		it('should return the first instance of the given type in a pointer', () => {
			const parent = new Instance('Part');
			const pointer = new Instance('ObjectValue');
			const part = new Instance('Part');
			pointer.Value = part;
			pointer.Name = 'Part';
			pointer.Parent = parent;

			const found = InstanceTree.findClassInChildren(parent, 'Part');
			expect(found).to.equal(part);
		});

		it('should respect the preferPointer option', () => {
			const parent = new Instance('Part');
			const part = new Instance('Part');
			const pointer = new Instance('ObjectValue');
			const targetPart = new Instance('Part');
			pointer.Value = targetPart;
			pointer.Name = 'Part';
			pointer.Parent = parent;
			part.Parent = parent;

			const found = InstanceTree.findClassInChildren(parent, 'Part', true);
			expect(found).to.equal(targetPart);
		});
	});
};
