import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TrailCityBanner } from "../TrailCityBanner";
import {
  terminalTheme,
  regalTheme,
  matrixTheme,
  slateTheme,
  slateNeonTheme,
  slateGoldTheme,
  enterpriseTheme,
  neuralPulseTheme,
  landingPageTheme,
  iceTangerineTheme,
  type Theme,
} from "@principal-ade/industry-theme";

const themes: Record<string, Theme> = {
  terminal: terminalTheme,
  regal: regalTheme,
  matrix: matrixTheme,
  slate: slateTheme,
  slateNeon: slateNeonTheme,
  slateGold: slateGoldTheme,
  enterprise: enterpriseTheme,
  neuralPulse: neuralPulseTheme,
  landingPage: landingPageTheme,
  iceTangerine: iceTangerineTheme,
};

const meta = {
  title: "Components/TrailCityBanner",
  component: TrailCityBanner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["twitterHeader", "linkedinCompany", "linkedinProfile"],
    },
    seed: { control: { type: "range", min: 1, max: 40, step: 1 } },
    reserveLeft: { control: "boolean" },
    showTrail: { control: "boolean" },
    showChip: { control: "boolean" },
    leaderMarker: { control: { type: "range", min: 1, max: 4, step: 1 } },
  },
} satisfies Meta<typeof TrailCityBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** X / Twitter company header preset — 1500×500. */
export const TwitterHeader: Story = {
  args: { variant: "twitterHeader", theme: landingPageTheme },
  render: (args) => (
    <div style={{ width: 1080, maxWidth: "92vw" }}>
      <TrailCityBanner {...args} />
    </div>
  ),
};

/** LinkedIn company page cover preset — 1128×191. */
export const LinkedInCompanyCover: Story = {
  args: { variant: "linkedinCompany", theme: landingPageTheme },
  render: (args) => (
    <div style={{ width: 1015, maxWidth: "92vw" }}>
      <TrailCityBanner {...args} />
    </div>
  ),
};

/** LinkedIn personal/employee profile background — 1584×396 (4:1). */
export const LinkedInProfileBackground: Story = {
  args: { variant: "linkedinProfile", theme: landingPageTheme },
  render: (args) => (
    <div style={{ width: 1056, maxWidth: "92vw" }}>
      <TrailCityBanner {...args} />
    </div>
  ),
};

/** Both presets stacked so the shape difference reads at a glance. */
export const BothPresets: Story = {
  render: (args) => (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
        width: 1080,
        maxWidth: "92vw",
      }}
    >
      <TrailCityBanner {...args} variant="twitterHeader" />
      <TrailCityBanner {...args} variant="linkedinCompany" />
    </div>
  ),
  args: { theme: landingPageTheme },
};

/** Seed sweep — change `seed` to reshuffle the skyline deterministically. */
export const SeedVariations: Story = {
  render: (args) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 1000, maxWidth: "92vw" }}>
      {[7, 12, 23, 31].map((seed) => (
        <TrailCityBanner key={seed} {...args} seed={seed} variant="twitterHeader" />
      ))}
    </div>
  ),
  args: { theme: landingPageTheme },
};

/** Theme switcher across the full palette set. */
const ThemeSwitcherDemo = () => {
  const [selected, setSelected] = useState("landingPage");
  const theme = themes[selected];
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: 32,
        background: theme.colors.background,
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 800 }}>
        {Object.keys(themes).map((name) => (
          <button
            key={name}
            onClick={() => setSelected(name)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: selected === name ? "2px solid" : "1px solid",
              borderColor: selected === name ? themes[name].colors.primary : themes[name].colors.border,
              background: selected === name ? themes[name].colors.primary : themes[name].colors.backgroundSecondary,
              color: selected === name ? themes[name].colors.textOnPrimary : themes[name].colors.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: selected === name ? 600 : 400,
            }}
          >
            {name}
          </button>
        ))}
      </div>
      <div style={{ width: 1080, maxWidth: "92vw", display: "flex", flexDirection: "column", gap: 20 }}>
        <TrailCityBanner variant="twitterHeader" theme={theme} />
        <TrailCityBanner variant="linkedinCompany" theme={theme} />
      </div>
    </div>
  );
};

export const ThemeSwitcher: Story = {
  render: () => <ThemeSwitcherDemo />,
  parameters: { layout: "fullscreen" },
};
