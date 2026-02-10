import type { Meta, StoryObj } from "@storybook/react";
import { MazeDemo } from "../MazeDemo";

const meta: Meta<typeof MazeDemo> = {
  title: "Marketing/MazeDemo",
  component: MazeDemo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    width: {
      control: { type: "range", min: 400, max: 600, step: 50 },
    },
    height: {
      control: { type: "range", min: 500, max: 800, step: 50 },
    },
    theme: {
      control: "object",
      description: "Theme object with color properties",
    },
    mazeSeed: {
      control: { type: "number" },
      description: "Seed for maze generation (change to generate different mazes)",
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 450,
    height: 620,
    mazeSeed: 42,
  },
};

export const DifferentMaze: Story = {
  args: {
    width: 450,
    height: 620,
    mazeSeed: 123,
  },
};

export const AnotherMaze: Story = {
  args: {
    width: 450,
    height: 620,
    mazeSeed: 999,
  },
};

export const CustomColors: Story = {
  args: {
    width: 450,
    height: 620,
    theme: {
      primary: "#8b5cf6",
      error: "#dc2626",
      warning: "#f97316",
      success: "#059669",
    },
    mazeSeed: 42,
  },
};

export const LargerFormat: Story = {
  args: {
    width: 550,
    height: 720,
    mazeSeed: 42,
  },
};

export const DarkTheme: Story = {
  args: {
    width: 450,
    height: 620,
    theme: {
      primary: "#60a5fa",
      error: "#f87171",
      warning: "#fbbf24",
      success: "#34d399",
    },
    mazeSeed: 42,
  },
  parameters: {
    backgrounds: { default: "dark" },
  },
};
