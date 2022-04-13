import { Make } from '@rbxts/altmake';
import { Asset } from 'Asset';
import { Numbers } from 'Numbers';

export const thanosParticles = Make('ParticleEmitter', {
	Brightness: 2,
	LightEmission: 0.1,
	LightInfluence: 0,
	Size: Numbers.manualSequence([0, 0.875], [0.36, 0.562], [1, 0.106]),
	Squash: new NumberSequence(-0.1),
	Texture: Asset.prefix(4632903235),
	Transparency: Numbers.manualSequence([0, 0.52], [0.21, 0.0463], [0.668, 0.31], [1, 1]),
	EmissionDirection: Enum.NormalId.Front,
	Lifetime: new NumberRange(1.5, 3),
	Rate: 50,
	Rotation: new NumberRange(20),
	Speed: new NumberRange(0.5),
	SpreadAngle: new Vector2(-10, -10),
	Shape: Enum.ParticleEmitterShape.Sphere,
	ShapePartial: 0.6,
	ShapeStyle: Enum.ParticleEmitterShapeStyle.Surface,
	Acceleration: new Vector3(0, 1, -1.5),
	Drag: 1,
	VelocityInheritance: 0,
});
