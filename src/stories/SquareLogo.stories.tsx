import type { Meta, StoryObj } from '@storybook/react';
import { SquareLogo } from '../SquareLogo';

const meta = {
  title: 'Components/SquareLogo',
  component: SquareLogo,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: { type: 'range', min: 50, max: 500, step: 10 },
      description: 'Width of the logo',
    },
    height: {
      control: { type: 'range', min: 50, max: 500, step: 10 },
      description: 'Height of the logo',
    },
    colors: {
      control: 'object',
      description: 'Array of colors for the rectangles [topLeft, topRight, bottomLeft, bottomRight]',
    },
    opacity: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Overall opacity of the logo',
    },
  },
} satisfies Meta<typeof SquareLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 150,
    height: 150,
  },
};

export const Large: Story = {
  args: {
    width: 300,
    height: 300,
  },
};

export const Small: Story = {
  args: {
    width: 80,
    height: 80,
  },
};

export const CustomColors: Story = {
  args: {
    width: 200,
    height: 200,
    colors: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
  },
};

export const Monochrome: Story = {
  args: {
    width: 200,
    height: 200,
    colors: ['#1a1a1a', '#4a4a4a', '#6a6a6a', '#8a8a8a'],
  },
};

export const Vibrant: Story = {
  args: {
    width: 200,
    height: 200,
    colors: ['#ff0080', '#7928ca', '#ff0080', '#7928ca'],
  },
};

export const WithLowOpacity: Story = {
  args: {
    width: 200,
    height: 200,
    opacity: 0.5,
  },
};

export const OnDarkBackground: Story = {
  args: {
    width: 200,
    height: 200,
    colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A'],
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const OnLightBackground: Story = {
  args: {
    width: 200,
    height: 200,
    colors: ['#c0392b', '#16a085', '#2980b9', '#d35400'],
  },
  parameters: {
    backgrounds: { default: 'light' },
  },
};
