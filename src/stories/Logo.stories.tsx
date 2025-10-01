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
