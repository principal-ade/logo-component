import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { TrailCityDiagram } from "../TrailCityDiagram";
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
  title: "Components/TrailCityDiagram",
  component: TrailCityDiagram,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TrailCityDiagram>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default look — full city, trail, snippet card, on the landing theme. */
export const Default: Story = {
  args: {
    theme: landingPageTheme,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityDiagram {...args} />
    </div>
  ),
};

/** Trail spotlight — city + snippet dim, dashed path animates. */
export const HighlightTrail: Story = {
  args: {
    theme: landingPageTheme,
    highlightTrail: true,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityDiagram {...args} />
    </div>
  ),
};

/** Just the file city — no trail, no snippet. */
export const CityOnly: Story = {
  args: {
    theme: landingPageTheme,
    hideTrail: true,
    hideSnippet: true,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityDiagram {...args} />
    </div>
  ),
};

/** The collaboration sign-off row visible under the snippet. */
export const StampRow: Story = {
  args: {
    theme: landingPageTheme,
    stampRowVisible: true,
  },
  render: (args) => (
    <div style={{ width: 600, maxWidth: "90vw" }}>
      <TrailCityDiagram {...args} />
    </div>
  ),
};

const ThemeSwitcherDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>("landingPage");
  const theme = themes[selectedTheme];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: 32,
        backgroundColor: theme.colors.background,
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          maxWidth: 800,
        }}
      >
        {Object.keys(themes).map((themeName) => (
          <button
            key={themeName}
            onClick={() => setSelectedTheme(themeName)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: selectedTheme === themeName ? "2px solid" : "1px solid",
              borderColor:
                selectedTheme === themeName
                  ? themes[themeName].colors.primary
                  : themes[themeName].colors.border,
              backgroundColor:
                selectedTheme === themeName
                  ? themes[themeName].colors.primary
                  : themes[themeName].colors.backgroundSecondary,
              color:
                selectedTheme === themeName
                  ? themes[themeName].colors.textOnPrimary
                  : themes[themeName].colors.text,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: selectedTheme === themeName ? 600 : 400,
              transition: "all 0.2s ease",
            }}
          >
            {themeName}
          </button>
        ))}
      </div>

      <div style={{ width: 600, maxWidth: "90vw" }}>
        <TrailCityDiagram theme={theme} />
      </div>
    </div>
  );
};

export const ThemeSwitcher: Story = {
  render: () => <ThemeSwitcherDemo />,
  parameters: {
    layout: "fullscreen",
  },
};
