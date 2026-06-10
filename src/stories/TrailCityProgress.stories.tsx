import type { Meta, StoryObj } from "@storybook/react";
import React, { useEffect, useRef, useState } from "react";
import { TrailCityProgress } from "../TrailCityProgress";
import { landingPageTheme } from "@principal-ade/industry-theme";

const meta = {
  title: "Components/TrailCityProgress",
  component: TrailCityProgress,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TrailCityProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Static — set a fixed progress value to inspect a partially filled map. */
export const HalfFull: Story = {
  args: {
    theme: landingPageTheme,
    progress: 0.5,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityProgress {...args} />
    </div>
  ),
};

/** Fully populated. */
export const Full: Story = {
  args: {
    theme: landingPageTheme,
    progress: 1,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityProgress {...args} />
    </div>
  ),
};

/**
 * Step-driven demo — mimics the landing hero: progress climbs by one step
 * every couple of seconds, like the city populating as the headline cycles
 * through phrases. Resets and loops.
 */
const SteppingDemo = ({ steps = 16 }: { steps?: number }) => {
  const [step, setStep] = useState(0);
  const stepRef = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      stepRef.current = (stepRef.current + 1) % (steps + 4); // pause a beat once full
      setStep(stepRef.current);
    }, 1600);
    return () => clearInterval(id);
  }, [steps]);

  const progress = Math.min(1, step / steps);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        padding: 32,
        backgroundColor: landingPageTheme.colors.background,
      }}
    >
      <div style={{ width: 560, maxWidth: "90vw" }}>
        <TrailCityProgress theme={landingPageTheme} progress={progress} />
      </div>
      <div
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          color: landingPageTheme.colors.text,
        }}
      >
        step {Math.min(step, steps)}/{steps} · progress {progress.toFixed(2)}
      </div>
    </div>
  );
};

export const Stepping: Story = {
  render: () => <SteppingDemo />,
  parameters: {
    layout: "fullscreen",
  },
};
