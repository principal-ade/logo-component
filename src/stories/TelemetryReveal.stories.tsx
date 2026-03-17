import type { Meta, StoryObj } from "@storybook/react";
import { TelemetryReveal } from "../TelemetryReveal";

const meta = {
  title: "Components/TelemetryReveal",
  component: TelemetryReveal,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
        { name: "blue", value: "#0d1b2a" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "range", min: 100, max: 600, step: 20 },
      description: "Width of the component in pixels",
    },
    height: {
      control: { type: "range", min: 100, max: 600, step: 20 },
      description: "Height of the component in pixels",
    },
    preset: {
      control: "select",
      options: ["network", "tree", "circuit", "hexagon", "codebase"],
      description: "Built-in shape preset to use",
    },
    chaosMode: {
      control: "select",
      options: ["none", "fragmented"],
      description: "Show fragmented assembly before structure reveals",
    },
    chaosDuration: {
      control: { type: "range", min: 0.5, max: 5, step: 0.25 },
      description: "Duration of assembly phase (seconds)",
    },
    dotsDuration: {
      control: { type: "range", min: 0.3, max: 3, step: 0.1 },
      description: "Duration of dots-to-lines phase (seconds)",
    },
    flowDuration: {
      control: { type: "range", min: 0.5, max: 5, step: 0.25 },
      description: "Duration for particles to traverse paths (seconds)",
    },
    flowDelay: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
      description: "Delay before flow phase begins (seconds)",
    },
    particlesPerPath: {
      control: { type: "range", min: 1, max: 5, step: 1 },
      description: "Number of particles per path",
    },
    particleRadius: {
      control: { type: "range", min: 1, max: 8, step: 0.5 },
      description: "Radius of flow particles",
    },
    color: {
      control: "color",
      description: "Color of the paths",
    },
    particleColor: {
      control: "color",
      description: "Color of the flow particles (defaults to color)",
    },
    strokeWidth: {
      control: { type: "range", min: 1, max: 5, step: 0.5 },
      description: "Width of path strokes",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Overall opacity",
    },
    showGlow: {
      control: "boolean",
      description: "Show glow effect on particles",
    },
    fadeAfterAssembly: {
      control: "boolean",
      description: "Fade paths after assembly completes",
    },
    fadeOpacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
      description: "Opacity to fade paths to after drawing",
    },
    loop: {
      control: "boolean",
      description: "Loop the animation",
    },
    loopDelay: {
      control: { type: "range", min: 0, max: 3, step: 0.25 },
      description: "Pause between animation loops (seconds)",
    },
  },
} satisfies Meta<typeof TelemetryReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 300,
    height: 300,
    preset: "network",
    color: "#00ffff",
    particleColor: "#00ff88",
  },
};

export const NetworkMap: Story = {
  args: {
    width: 400,
    height: 400,
    preset: "network",
    color: "#4a9eff",
    particleColor: "#ffffff",
    flowDuration: 1.5,
  },
};

export const CodebaseTree: Story = {
  args: {
    width: 350,
    height: 350,
    preset: "tree",
    color: "#27ae60",
    particleColor: "#f1c40f",
  },
};

export const CircuitBoard: Story = {
  args: {
    width: 400,
    height: 400,
    preset: "circuit",
    color: "#e74c3c",
    particleColor: "#f39c12",
    particlesPerPath: 3,
  },
  parameters: {
    backgrounds: { default: "blue" },
  },
};

export const HexagonalStructure: Story = {
  args: {
    width: 350,
    height: 350,
    preset: "hexagon",
    color: "#9b59b6",
    particleColor: "#e91e63",
    strokeWidth: 2.5,
  },
};

export const CodebaseVisualization: Story = {
  args: {
    width: 400,
    height: 400,
    preset: "codebase",
    color: "#1abc9c",
    particleColor: "#3498db",
    flowDuration: 2.5,
  },
};

export const CustomPaths: Story = {
  args: {
    width: 300,
    height: 300,
    paths: [
      { d: "M 150,180 L 150,100", id: "custom-1" },
      { d: "M 150,100 L 250,50", id: "custom-2" },
      { d: "M 150,100 L 50,50", id: "custom-3" },
      { d: "M 250,50 L 280,100", id: "custom-4" },
      { d: "M 50,50 L 20,100", id: "custom-5" },
    ],
    viewBox: "0 0 300 200",
    color: "#ff6b6b",
    particleColor: "#feca57",
  },
};

export const SlowReveal: Story = {
  args: {
    width: 400,
    height: 400,
    preset: "network",
    color: "#ffffff",
    flowDuration: 4,
    flowDelay: 0.5,
  },
};

export const NoLoop: Story = {
  args: {
    width: 300,
    height: 300,
    preset: "tree",
    color: "#00ffff",
    loop: false,
  },
};

export const NoGlow: Story = {
  args: {
    width: 300,
    height: 300,
    preset: "network",
    color: "#ffffff",
    particleColor: "#ff00ff",
    showGlow: false,
  },
};

export const OnWhiteBackground: Story = {
  args: {
    width: 300,
    height: 300,
    preset: "codebase",
    color: "#333333",
    particleColor: "#0066cc",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

// Fragmented assembly - showing raw telemetry assembling into structure

export const FragmentedAssembly: Story = {
  name: "Fragmented Assembly",
  args: {
    width: 400,
    height: 400,
    preset: "network",
    chaosMode: "fragmented",
    dotsDuration: 2,
    chaosDuration: 3,
    color: "#00ffff",
    particleColor: "#00ff88",
  },
};

export const FragmentedTree: Story = {
  name: "Fragmented Tree",
  args: {
    width: 400,
    height: 400,
    preset: "tree",
    chaosMode: "fragmented",
    chaosDuration: 2,
    color: "#9b59b6",
    particleColor: "#e91e63",
  },
};

export const FragmentedCodebase: Story = {
  name: "Fragmented Codebase",
  args: {
    width: 450,
    height: 450,
    preset: "codebase",
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    color: "#1abc9c",
    particleColor: "#3498db",
  },
};

export const FullStory: Story = {
  name: "Full Animation Story",
  args: {
    width: 500,
    height: 500,
    preset: "network",
    chaosMode: "fragmented",
    chaosDuration: 2,
    flowDuration: 2,
    flowDelay: 0.3,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 2,
  },
};
