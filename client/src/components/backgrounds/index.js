import OrbsBackground from './OrbsBackground';
import WavesBackground from './WavesBackground';
import MatrixBackground from './MatrixBackground';
import ConstellationBackground from './ConstellationBackground';
import GradientMeshBackground from './GradientMeshBackground';
import NeonGridBackground from './NeonGridBackground';
import ParticleVortexBackground from './ParticleVortexBackground';
import HolographicBackground from './HolographicBackground';
import FirefliesBackground from './FirefliesBackground';
import PlasmaBackground from './PlasmaBackground';
import DigitalRainBackground from './DigitalRainBackground';
import NebulaBackground from './NebulaBackground';
import LightningBackground from './LightningBackground';
import StarfieldWarpBackground from './StarfieldWarpBackground';

export const backgroundComponents = {
    orbs: OrbsBackground,
    waves: WavesBackground,
    matrix: MatrixBackground,
    constellation: ConstellationBackground,
    gradientMesh: GradientMeshBackground,
    neonGrid: NeonGridBackground,
    particleVortex: ParticleVortexBackground,
    holographic: HolographicBackground,
    fireflies: FirefliesBackground,
    plasma: PlasmaBackground,
    digitalRain: DigitalRainBackground,
    nebula: NebulaBackground,
    lightning: LightningBackground,
    starfieldWarp: StarfieldWarpBackground,
};

export const backgroundList = [
    {
        id: 'orbs',
        name: 'Floating Orbs',
        description: 'Colorful blurred orbs with a grid overlay and floating particles',
    },
    {
        id: 'waves',
        name: 'Aurora Waves',
        description: 'Smooth flowing aurora wave bands with gentle pulsing light',
    },
    {
        id: 'matrix',
        name: 'Cyber Matrix',
        description: 'Futuristic falling digital rain with glowing streaks',
    },
    {
        id: 'constellation',
        name: 'Constellation',
        description: 'Twinkling stars with subtle connecting lines, deep space vibes',
    },
    {
        id: 'gradientMesh',
        name: 'Gradient Mesh',
        description: 'Morphing fluid gradient blobs with a liquid glass aesthetic',
    },
    {
        id: 'neonGrid',
        name: 'Neon Pulse Grid',
        description: 'Cyberpunk grid with pulsing lines and glowing intersection nodes',
    },
    {
        id: 'particleVortex',
        name: 'Particle Vortex',
        description: 'Swirling multi-colored particles orbiting a glowing center',
    },
    {
        id: 'holographic',
        name: 'Holographic',
        description: 'Rainbow prismatic shimmer bands with a scanline overlay',
    },
    {
        id: 'fireflies',
        name: 'Fireflies',
        description: 'Warm amber-gold glowing dots drifting gently like fireflies',
    },
    {
        id: 'plasma',
        name: 'Plasma Field',
        description: 'Organic flowing plasma interference patterns in deep violet',
    },
    {
        id: 'digitalRain',
        name: 'Digital Rain',
        description: 'Purple Matrix-style falling katakana characters with glow',
    },
    {
        id: 'nebula',
        name: 'Deep Nebula',
        description: 'Cosmic nebula clouds with twinkling stars and drifting gas',
    },
    {
        id: 'lightning',
        name: 'Electric Storm',
        description: 'Dramatic lightning bolts with branching, glow, and flash effects',
    },
    {
        id: 'starfieldWarp',
        name: 'Starfield Warp',
        description: 'Hyperspace warp drive with stars streaking from the center',
    },
    {
        id: 'none',
        name: 'None',
        description: 'Clean dark background with no animations',
    },
];
