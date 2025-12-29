import type { Meta, StoryObj } from '@storybook/react';
import { LogoSmall } from '../LogoSmall';

const meta = {
  title: 'Components/LogoSmall',
  component: LogoSmall,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    width: { control: { type: 'number', min: 16, max: 200 } },
    height: { control: { type: 'number', min: 16, max: 200 } },
    color: { control: 'color' },
    particleColor: { control: 'color' },
    opacity: { control: { type: 'range', min: 0, max: 1, step: 0.1 } },
  },
} satisfies Meta<typeof LogoSmall>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    width: 32,
    height: 32,
  },
};

export const Medium: Story = {
  args: {
    width: 48,
    height: 48,
  },
};

export const Large: Story = {
  args: {
    width: 64,
    height: 64,
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      <LogoSmall width={16} height={16} />
      <LogoSmall width={24} height={24} />
      <LogoSmall width={32} height={32} />
      <LogoSmall width={48} height={48} />
      <LogoSmall width={64} height={64} />
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    width: 48,
    height: 48,
    color: '#6366f1',
  },
};

export const OnDarkBackground: Story = {
  args: {
    width: 48,
    height: 48,
    color: '#ffffff',
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: '#1a1a2e', padding: '24px', borderRadius: '8px' }}>
        <Story />
      </div>
    ),
  ],
};
