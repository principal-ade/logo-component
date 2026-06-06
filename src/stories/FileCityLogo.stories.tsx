import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileCityLogo } from "../FileCityLogo";
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
  iceTangerineDarkTheme,
  type Theme,
} from "@principal-ade/industry-theme";

const themes: Record<string, Theme> = {
  iceTangerineDark: iceTangerineDarkTheme,
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

/** The brand default theme for the logo. */
const defaultTheme = iceTangerineDarkTheme;

const meta = {
  title: "Components/FileCityLogo",
  component: FileCityLogo,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "brand",
      values: [
        { name: "brand", value: "#081a33" },
        { name: "light", value: "#ffffff" },
      ],
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof FileCityLogo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    theme: defaultTheme,
    mark: "P",
    width: 200,
    height: 200,
  },
};

/** Brand lockup — P on the left with a stacked "AI" (A over I) filling
 *  the right three columns. */
export const Lockup: Story = {
  args: {
    theme: defaultTheme,
    mark: "lockup",
    width: 220,
    height: 220,
  },
};

/** Ice Tangerine, three ways: the custom "inverted" colors from
 *  LOGO-DEPLOYMENTS.md vs the two real presets (dark + light) driven by
 *  the theme prop. */
export const IceTangerine: Story = {
  render: () => {
    const Cell = ({ label, node }: { label: string; node: React.ReactNode }) => (
      <div style={{ textAlign: "center" }}>
        {node}
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <Cell
          label="doc inverted (custom)"
          node={
            <FileCityLogo
              mark="P"
              width={200}
              height={200}
              primary="#ff6b35"
              accent="#e8f4f6"
              color="#e8f4f6"
              background="#0c1741"
            />
          }
        />
        <Cell
          label="iceTangerineDarkTheme (preset)"
          node={<FileCityLogo mark="P" width={200} height={200} theme={iceTangerineDarkTheme} />}
        />
        <Cell
          label="iceTangerineTheme (preset, light)"
          node={<FileCityLogo mark="P" width={200} height={200} theme={iceTangerineTheme} />}
        />
      </div>
    );
  },
};

/** Color-gradient variations on the default (P) mark — scatter (random
 *  shade) vs the directional dark→light gradients. */
export const Gradients: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {(["scatter", "vertical", "horizontal", "diagonal"] as const).map((g) => (
        <div key={g} style={{ textAlign: "center" }}>
          <FileCityLogo
            theme={defaultTheme}
            mark="P"
            gradient={g}
            width={160}
            height={160}
          />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            gradient="{g}"
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Kept for posterity — the same gradient variations on the lockup. */
export const LockupGradients: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
      {(["scatter", "vertical", "horizontal", "diagonal"] as const).map((g) => (
        <div key={g} style={{ textAlign: "center" }}>
          <FileCityLogo
            theme={defaultTheme}
            mark="lockup"
            gradient={g}
            width={160}
            height={160}
          />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            gradient="{g}"
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Part of the P rendered as a code trail — the descender + bowl base
 *  become a dashed path with marker dots. */
export const WithTrail: Story = {
  args: {
    theme: defaultTheme,
    mark: "P",
    trail: true,
    width: 200,
    height: 200,
  },
};

/** The brand marks — the accent files spell P / AI / PAI; "none" is a
 *  plain city grid. Flip between them to pick the icon. */
export const Marks: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
      {(["P", "AI", "PAI", "none"] as const).map((m) => (
        <div key={m} style={{ textAlign: "center" }}>
          <FileCityLogo theme={defaultTheme} mark={m} width={160} height={160} />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>mark="{m}"</div>
        </div>
      ))}
    </div>
  ),
};

/** Plain city grid, no highlighted file. */
export const PlainCity: Story = {
  args: {
    theme: defaultTheme,
    mark: "none",
    width: 200,
    height: 200,
    highlight: false,
  },
};

/** Transparent panel — drop the mark onto any surface. */
export const Transparent: Story = {
  args: {
    theme: defaultTheme,
    width: 200,
    height: 200,
    background: "transparent",
    rounded: false,
  },
  render: (args) => (
    <div style={{ padding: 24, background: "#11161d" }}>
      <FileCityLogo {...args} />
    </div>
  ),
};

/** Favicon-scale sizes. */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
      {[32, 48, 64, 96, 128].map((s) => (
        <FileCityLogo key={s} theme={defaultTheme} width={s} height={s} />
      ))}
    </div>
  ),
};

/** Plain-city density — fewer / more squares via the `cells` prop
 *  (applies to mark="none"). */
export const Density: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16 }}>
      {[4, 5, 6, 7].map((n) => (
        <div key={n} style={{ textAlign: "center" }}>
          <FileCityLogo theme={defaultTheme} mark="none" highlight={false} width={120} height={120} cells={n} />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>cells={n}</div>
        </div>
      ))}
    </div>
  ),
};

/** The logo next to the full diagram, to confirm they read as a set. */
export const NextToDiagram: Story = {
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <FileCityLogo theme={defaultTheme} width={160} height={160} />
      <div style={{ width: 360 }}>
        <TrailCityDiagram theme={defaultTheme} />
      </div>
    </div>
  ),
  parameters: { layout: "fullscreen" },
};

const ThemeSwitcherDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>("iceTangerineDark");
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

      <FileCityLogo theme={theme} width={220} height={220} />
    </div>
  );
};

export const ThemeSwitcher: Story = {
  render: () => <ThemeSwitcherDemo />,
  parameters: {
    layout: "fullscreen",
  },
};
