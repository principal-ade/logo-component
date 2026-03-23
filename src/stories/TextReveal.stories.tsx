import type { Meta, StoryObj } from "@storybook/react";
import { TextReveal } from "../TextReveal";

const meta = {
  title: "Components/TextReveal",
  component: TextReveal,
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
    text: {
      control: "text",
      description: "The text to display",
    },
    width: {
      control: { type: "range", min: 200, max: 800, step: 20 },
      description: "Width of the component in pixels",
    },
    height: {
      control: { type: "range", min: 60, max: 300, step: 10 },
      description: "Height of the component in pixels",
    },
    scale: {
      control: { type: "range", min: 0.5, max: 3, step: 0.1 },
      description: "Scale factor for the text",
    },
    letterSpacing: {
      control: { type: "range", min: 0, max: 20, step: 1 },
      description: "Spacing between letters",
    },
    centerText: {
      control: "boolean",
      description: "Center the text in the container",
    },
    chaosMode: {
      control: "select",
      options: ["none", "fragmented"],
      description: "Show fragmented assembly before text reveals",
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
      control: { type: "range", min: 1, max: 6, step: 0.5 },
      description: "Radius of flow particles",
    },
    color: {
      control: "color",
      description: "Color of the text paths",
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
} satisfies Meta<typeof TextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "HELLO",
    width: 400,
    height: 100,
    color: "#00ffff",
    particleColor: "#00ff88",
  },
};

export const Telemetry: Story = {
  args: {
    text: "TELEMETRY",
    width: 500,
    height: 120,
    scale: 1.2,
    color: "#4a9eff",
    particleColor: "#ffffff",
    flowDuration: 1.5,
  },
};

export const FragmentedHello: Story = {
  name: "Fragmented Hello",
  args: {
    text: "HELLO",
    width: 500,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 2,
    dotsDuration: 1.5,
    color: "#00ffff",
    particleColor: "#00ff88",
  },
};

export const FragmentedWorld: Story = {
  name: "Fragmented World",
  args: {
    text: "WORLD",
    width: 500,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    color: "#9b59b6",
    particleColor: "#e91e63",
  },
};

export const CodeWord: Story = {
  args: {
    text: "CODE",
    width: 350,
    height: 120,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 1.5,
    color: "#27ae60",
    particleColor: "#f1c40f",
  },
};

export const Numbers: Story = {
  args: {
    text: "12345",
    width: 400,
    height: 100,
    color: "#e74c3c",
    particleColor: "#f39c12",
    flowDuration: 2,
  },
};

export const MixedCase: Story = {
  args: {
    text: "Hello World",
    width: 500,
    height: 120,
    color: "#ffffff",
    particleColor: "#00ffff",
  },
};

export const LowercaseOnly: Story = {
  name: "Lowercase",
  args: {
    text: "telemetry",
    width: 400,
    height: 100,
    color: "#1abc9c",
    particleColor: "#3498db",
  },
};

export const FragmentedMixed: Story = {
  name: "Fragmented Mixed Case",
  args: {
    text: "Hello",
    width: 400,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 2,
    color: "#ff6b6b",
    particleColor: "#feca57",
  },
};

export const LargeScale: Story = {
  args: {
    text: "BIG",
    width: 400,
    height: 200,
    scale: 2.5,
    color: "#ffffff",
    strokeWidth: 3,
    particleRadius: 4,
  },
};

export const SmallScale: Story = {
  args: {
    text: "tiny text here",
    width: 400,
    height: 60,
    scale: 0.6,
    color: "#888888",
    particleColor: "#ffffff",
    strokeWidth: 1,
    particleRadius: 1.5,
  },
};

export const NoLoop: Story = {
  args: {
    text: "ONCE",
    width: 300,
    height: 100,
    color: "#00ffff",
    loop: false,
  },
};

export const NoGlow: Story = {
  args: {
    text: "FLAT",
    width: 300,
    height: 100,
    color: "#ffffff",
    particleColor: "#ff00ff",
    showGlow: false,
  },
};

export const FastAnimation: Story = {
  args: {
    text: "SPEED",
    width: 350,
    height: 100,
    chaosMode: "fragmented",
    chaosDuration: 1,
    dotsDuration: 0.5,
    flowDuration: 0.8,
    color: "#ffff00",
    particleColor: "#ff8800",
  },
};

export const SlowDramatic: Story = {
  name: "Slow Dramatic",
  args: {
    text: "REVEAL",
    width: 450,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 4,
    dotsDuration: 2,
    flowDuration: 3,
    flowDelay: 0.5,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 2,
  },
};

export const MultipleParticles: Story = {
  args: {
    text: "FLOW",
    width: 350,
    height: 120,
    scale: 1.5,
    particlesPerPath: 3,
    flowDuration: 2,
    color: "#e74c3c",
    particleColor: "#f39c12",
  },
};

export const OnWhiteBackground: Story = {
  args: {
    text: "LIGHT",
    width: 350,
    height: 100,
    color: "#333333",
    particleColor: "#0066cc",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const FullStory: Story = {
  name: "Full Animation Story",
  args: {
    text: "TELEMETRY",
    width: 600,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    dotsDuration: 1.5,
    flowDuration: 2,
    flowDelay: 0.3,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 2,
  },
};

export const Punctuation: Story = {
  args: {
    text: "HELLO!",
    width: 400,
    height: 100,
    color: "#ff6b6b",
    particleColor: "#ffffff",
  },
};

export const Question: Story = {
  args: {
    text: "WHY?",
    width: 300,
    height: 100,
    chaosMode: "fragmented",
    color: "#9b59b6",
    particleColor: "#e91e63",
  },
};

export const PrincipalAI: Story = {
  name: "Principal AI",
  args: {
    text: "Principal AI",
    width: 550,
    height: 120,
    scale: 1.2,
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    dotsDuration: 1.5,
    flowDuration: 2,
    color: "#00ffff",
    particleColor: "#00ff88",
    loopDelay: 2,
  },
};

export const PrincipalAIUppercase: Story = {
  name: "PRINCIPAL AI",
  args: {
    text: "PRINCIPAL AI",
    width: 600,
    height: 150,
    scale: 1.5,
    chaosMode: "fragmented",
    chaosDuration: 3,
    dotsDuration: 2,
    flowDuration: 2,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 2,
  },
};
