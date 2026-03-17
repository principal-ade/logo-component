# TelemetryReveal Component

## Purpose

Visually conveys how telemetry reveals the shape of a codebase. The animation tells a story: raw data points connect into lines, which then assemble into a meaningful structure that data flows through.

## Animation Phases

When `chaosMode="fragmented"` is enabled, the animation has four sequential phases:

### 1. Dots Phase
- Endpoint dots appear **one at a time** at scattered/offset positions
- Each dot pair (start + end of a line segment) appears and stays visible
- Dots are sized to match the line thickness for seamless transition

### 2. Lines Phase
- Lines draw **one at a time** from start dot to end dot
- Each line fully completes before the next begins
- Dots fade out after their line is drawn

### 3. Assembly Phase
- Lines move **one at a time** from scattered positions to their final positions
- Creates the effect of fragmented telemetry assembling into coherent structure

### 4. Flow Phase
- Particles flow through the assembled paths
- Represents data/telemetry flowing through the revealed structure

## Design Decisions

### Sequential vs Overlapping Animations
We chose **fully sequential** animations (one completes before next starts) rather than staggered/overlapping. This makes each step clear and deliberate, reinforcing the narrative of structure being revealed piece by piece.

### Dots as Line Endpoints
Dots appear at both start and end points of each line segment. This shows that telemetry captures discrete data points, which then connect to reveal relationships.

### Dot Size Matching Line Width
Dots have the same diameter as the line stroke width (`strokeWidth / 2` radius). This creates a seamless visual transition when the line draws through the dots.

### Fragmented Starting Positions
Lines start at random offset positions (scattered). This represents raw, unstructured telemetry before our approach organizes it into meaningful architecture.

### Smooth Assembly Easing
Assembly animation uses ease-out curve (`0.33 0 0.2 1`) so lines decelerate as they settle into place, feeling natural and deliberate.

## Props

| Prop | Default | Description |
|------|---------|-------------|
| `chaosMode` | `"none"` | `"fragmented"` enables the full animation sequence |
| `dotsDuration` | `2` | Total time for dots + lines phases (seconds) |
| `chaosDuration` | `3` | Time for assembly phase (seconds) |
| `flowDuration` | `2` | Time for particles to traverse paths |
| `flowDelay` | `0.3` | Pause between assembly and flow |
| `preset` | `"network"` | Shape preset: `network`, `tree`, `circuit`, `hexagon`, `codebase` |
| `paths` | - | Custom path definitions (overrides preset) |
| `loop` | `true` | Whether animation loops |
| `loopDelay` | `1` | Pause between loops |

## Shape Presets

- **network**: Central hub with radiating edges (star pattern)
- **tree**: Hierarchical tree with branches
- **circuit**: Horizontal buses with vertical connectors
- **hexagon**: Hexagon outline with spokes to center
- **codebase**: Folder/file tree structure with cross-references

## Usage

```tsx
import { TelemetryReveal } from '@principal-ai/logo-component';

// Full animation with fragmented assembly
<TelemetryReveal
  preset="network"
  chaosMode="fragmented"
  dotsDuration={2}
  chaosDuration={3}
  color="#00ffff"
  particleColor="#00ff88"
/>

// Simple flow animation (no assembly)
<TelemetryReveal
  preset="codebase"
  chaosMode="none"
  color="#1abc9c"
/>
```
