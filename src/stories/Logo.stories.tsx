import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "../Logo";

const meta = {
  title: "Components/Logo",
  component: Logo,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "range", min: 50, max: 500, step: 10 },
      description: "Width of the logo in pixels",
    },
    height: {
      control: { type: "range", min: 50, max: 500, step: 10 },
      description: "Height of the logo in pixels",
    },
    color: {
      control: "color",
      description: "Color of the wireframe lines",
    },
    particleColor: {
      control: "color",
      description: "Color of the animated particles (defaults to color if not set)",
    },
    horizontalColor: {
      control: "color",
      description: "Color for horizontal latitude lines (defaults to color)",
    },
    verticalColor: {
      control: "color",
      description: "Color for vertical longitude lines (defaults to color)",
    },
    diagonalColor: {
      control: "color",
      description: "Color for diagonal grid lines (defaults to color)",
    },
    outlineColor: {
      control: "color",
      description: "Color for the main sphere outline (defaults to color)",
    },
    showOutline: {
      control: "boolean",
      description: "Whether to show the main sphere outline",
    },
    axisColor: {
      control: "color",
      description: "Color for center axis lines (defaults to color)",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Overall opacity of the logo",
    },
  },
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 200,
    color: "#ffffff",
    particleColor: "#00ff00",
    opacity: 0.9,
  },
};

export const Large: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#00ffff",
    opacity: 0.9,
  },
};

export const Small: Story = {
  args: {
    width: 100,
    height: 100,
    color: "#00ffff",
    opacity: 0.9,
  },
};

export const CustomColors: Story = {
  args: {
    width: 200,
    height: 200,
    color: "#ff00ff",
    particleColor: "#ffff00",
    opacity: 0.9,
  },
};

export const LowOpacity: Story = {
  args: {
    width: 200,
    height: 200,
    color: "#00ffff",
    opacity: 0.5,
  },
};

export const OnWhiteBackground: Story = {
  args: {
    width: 200,
    height: 200,
    color: "#1a1a1a",
    particleColor: "#00aa00",
    opacity: 0.9,
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const MultiColoredLines: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#ffffff",
    horizontalColor: "#ff6b6b",
    verticalColor: "#4ecdc4",
    diagonalColor: "#ffe66d",
    outlineColor: "#ffffff",
    axisColor: "#95e1d3",
    particleColor: "#f38181",
    opacity: 0.9,
  },
};

export const CoolWarmContrast: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#ffffff",
    horizontalColor: "#ff7675",
    verticalColor: "#74b9ff",
    diagonalColor: "#a29bfe",
    outlineColor: "#dfe6e9",
    axisColor: "#ffeaa7",
    particleColor: "#00cec9",
    opacity: 0.9,
  },
};

export const NeonVibes: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#00ff00",
    horizontalColor: "#ff00ff",
    verticalColor: "#00ffff",
    diagonalColor: "#ffff00",
    outlineColor: "#ff00ff",
    axisColor: "#00ff00",
    particleColor: "#ffffff",
    opacity: 0.9,
  },
};

export const SunsetGradient: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#ff6b35",
    horizontalColor: "#ff6b35",
    verticalColor: "#f7c59f",
    diagonalColor: "#efa490",
    outlineColor: "#2e294e",
    axisColor: "#1b998b",
    particleColor: "#fffd82",
    opacity: 0.9,
  },
};

export const OceanDepth: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#0077b6",
    horizontalColor: "#00b4d8",
    verticalColor: "#90e0ef",
    diagonalColor: "#48cae4",
    outlineColor: "#caf0f8",
    axisColor: "#03045e",
    particleColor: "#ade8f4",
    opacity: 0.9,
  },
};

export const GoogleColors: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#4285F4",
    horizontalColor: "#EA4335",
    verticalColor: "#4285F4",
    diagonalColor: "#FBBC05",
    outlineColor: "#34A853",
    axisColor: "#EA4335",
    particleColor: "#FBBC05",
    opacity: 0.9,
  },
};

export const GoogleColorsNoOutline: Story = {
  args: {
    width: 300,
    height: 300,
    color: "#4285F4",
    horizontalColor: "#EA4335",
    verticalColor: "#4285F4",
    diagonalColor: "#FBBC05",
    showOutline: false,
    axisColor: "#34A853",
    particleColor: "#FBBC05",
    opacity: 0.9,
  },
};
