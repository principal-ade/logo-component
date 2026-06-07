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

/** The P with an "AI" file card tucked into the bottom-right — a nod to
 *  the filename + snippet card in TrailCityDiagram. The P shifts one
 *  column left to make room. */
export const AICard: Story = {
  args: {
    theme: defaultTheme,
    mark: "P",
    aiCard: true,
    width: 220,
    height: 220,
  },
};

/** Same P, tighter grid: dropping the margin ring from 1 → 0 packs the
 *  3×5 glyph into a 5×5 grid instead of 7×7, so each square is bigger. */
export const BiggerSquares: Story = {
  render: () => {
    const Cell = ({ label, margin }: { label: string; margin: number }) => (
      <div style={{ textAlign: "center" }}>
        <FileCityLogo theme={defaultTheme} mark="P" margin={margin} width={200} height={200} />
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
        <Cell label="margin=1 (7×7, default)" margin={1} />
        <Cell label="margin=0 (5×5, bigger squares)" margin={0} />
      </div>
    );
  },
};

/**
 * Square corner radius — softly rounded tiles (default 0.12) vs sharp
 * corners (0), shown across the main marks so you can judge the feel.
 */
export const SquareCorners: Story = {
  render: () => {
    const Col = ({ label, squareRadius }: { label: string; squareRadius: number }) => (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {(["P", "lockup", "none"] as const).map((m) => (
            <FileCityLogo
              key={m}
              theme={defaultTheme}
              mark={m}
              squareRadius={squareRadius}
              width={160}
              height={160}
            />
          ))}
        </div>
        <div style={{ color: "#888", fontSize: 12, marginTop: 8 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <Col label="squareRadius=0.12 (rounded, default)" squareRadius={0.12} />
        <Col label="squareRadius=0 (sharp)" squareRadius={0} />
      </div>
    );
  },
};

/** A finer sweep of corner radius on the default P, sharp → very round. */
export const SquareCornerSweep: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
      {[0, 0.06, 0.12, 0.22, 0.5].map((sr) => (
        <div key={sr} style={{ textAlign: "center" }}>
          <FileCityLogo
            theme={defaultTheme}
            mark="P"
            squareRadius={sr}
            width={160}
            height={160}
          />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            squareRadius={sr}
          </div>
        </div>
      ))}
    </div>
  ),
};

/** Glossy sheen — flat baseline vs the faint default. */
export const Gloss: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
      {([false, true] as const).map((g) => (
        <div key={String(g)} style={{ textAlign: "center" }}>
          <FileCityLogo theme={defaultTheme} mark="P" gloss={g} width={200} height={200} />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            gloss={String(g)}
          </div>
        </div>
      ))}
    </div>
  ),
};

/**
 * Light-direction sweep — the same faint sheen lit from each side so you
 * can pick where the "light source" sits. Top row no glint, bottom row
 * with the specular corner glint added.
 */
const GLOSS_SIDES = ["top", "top-left", "top-right", "left", "right"] as const;

export const GlossDirections: Story = {
  render: () => {
    const Row = ({ glint }: { glint: boolean }) => (
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
        {GLOSS_SIDES.map((side) => (
          <div key={side} style={{ textAlign: "center" }}>
            <FileCityLogo
              theme={defaultTheme}
              mark="P"
              gloss={{ side, intensity: 0.1, glint }}
              width={160}
              height={160}
            />
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
              {side}
              {glint ? " + glint" : ""}
            </div>
          </div>
        ))}
      </div>
    );
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <Row glint={false} />
        <Row glint={true} />
      </div>
    );
  },
};

/**
 * Intensity ramp — top-lit sheen from barely-there to candy-shiny, so you
 * can dial in how glossy it should read.
 */
export const GlossIntensity: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
      {[0, 0.06, 0.1, 0.16, 0.24].map((intensity) => (
        <div key={intensity} style={{ textAlign: "center" }}>
          <FileCityLogo
            theme={defaultTheme}
            mark="P"
            gloss={intensity === 0 ? false : { side: "top", intensity }}
            width={160}
            height={160}
          />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>
            {intensity === 0 ? "flat" : `intensity=${intensity}`}
          </div>
        </div>
      ))}
    </div>
  ),
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
