import type { Meta, StoryObj } from "@storybook/react";
import { WreathLogo } from "../WreathLogo";

const meta = {
  title: "Components/WreathLogo",
  component: WreathLogo,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "light",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
        { name: "cream", value: "#F5F5DC" },
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
    pColor: {
      control: "color",
      description: "Color of the letter P",
    },
    wreathColor: {
      control: "color",
      description: "Primary color of the wreath leaves",
    },
    leafAccentColor: {
      control: "color",
      description: "Accent color for alternating leaves",
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Overall opacity of the logo",
    },
    animationSpeed: {
      control: { type: "range", min: 1, max: 10, step: 0.5 },
      description: "Speed of animations in seconds",
    },
  },
} satisfies Meta<typeof WreathLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 200,
    height: 200,
    pColor: "#2C3E50",
    wreathColor: "#27AE60",
    leafAccentColor: "#52BE80",
    opacity: 0.9,
    animationSpeed: 3,
  },
};

export const GoldenWreath: Story = {
  args: {
    width: 250,
    height: 250,
    pColor: "#8B4513",
    wreathColor: "#DAA520",
    leafAccentColor: "#FFD700",
    opacity: 0.9,
    animationSpeed: 4,
  },
  parameters: {
    backgrounds: { default: "cream" },
  },
};

export const AutumnColors: Story = {
  args: {
    width: 220,
    height: 220,
    pColor: "#5D4037",
    wreathColor: "#D84315",
    leafAccentColor: "#FF6F00",
    opacity: 0.9,
    animationSpeed: 2.5,
  },
};

export const MonochromeElegant: Story = {
  args: {
    width: 200,
    height: 200,
    pColor: "#000000",
    wreathColor: "#4A4A4A",
    leafAccentColor: "#757575",
    opacity: 0.85,
    animationSpeed: 4,
  },
};

export const OliveWreath: Story = {
  args: {
    width: 200,
    height: 200,
    pColor: "#3E2723",
    wreathColor: "#6B8E23",
    leafAccentColor: "#9ACD32",
    opacity: 0.9,
    animationSpeed: 3.5,
  },
};

export const RoyalPurple: Story = {
  args: {
    width: 240,
    height: 240,
    pColor: "#4A148C",
    wreathColor: "#7B1FA2",
    leafAccentColor: "#BA68C8",
    opacity: 0.9,
    animationSpeed: 3,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};

export const FastAnimation: Story = {
  args: {
    width: 200,
    height: 200,
    pColor: "#2C3E50",
    wreathColor: "#27AE60",
    leafAccentColor: "#52BE80",
    opacity: 0.9,
    animationSpeed: 1.5,
  },
};

export const SlowAnimation: Story = {
  args: {
    width: 200,
    height: 200,
    pColor: "#2C3E50",
    wreathColor: "#27AE60",
    leafAccentColor: "#52BE80",
    opacity: 0.9,
    animationSpeed: 6,
  },
};

export const Large: Story = {
  args: {
    width: 400,
    height: 400,
    pColor: "#2C3E50",
    wreathColor: "#27AE60",
    leafAccentColor: "#52BE80",
    opacity: 0.9,
    animationSpeed: 3,
  },
};

export const Small: Story = {
  args: {
    width: 100,
    height: 100,
    pColor: "#2C3E50",
    wreathColor: "#27AE60",
    leafAccentColor: "#52BE80",
    opacity: 0.9,
    animationSpeed: 3,
  },
};
