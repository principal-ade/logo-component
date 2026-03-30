import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { Logo } from "../Logo";
import {
  terminalTheme,
  regalTheme,
  matrixTheme,
  matrixMinimalTheme,
  slateTheme,
  slateNeonTheme,
  slateGoldTheme,
  enterpriseTheme,
  neuralPulseTheme,
  humanCentricTheme,
  defaultMarkdownTheme,
  defaultEditorTheme,
  defaultTerminalTheme,
  landingPageTheme,
  landingPageLightTheme,
  type Theme,
} from "@principal-ade/industry-theme";

const themes: Record<string, Theme> = {
  terminal: terminalTheme,
  regal: regalTheme,
  matrix: matrixTheme,
  matrixMinimal: matrixMinimalTheme,
  slate: slateTheme,
  slateNeon: slateNeonTheme,
  slateGold: slateGoldTheme,
  enterprise: enterpriseTheme,
  neuralPulse: neuralPulseTheme,
  humanCentric: humanCentricTheme,
  defaultMarkdown: defaultMarkdownTheme,
  defaultEditor: defaultEditorTheme,
  defaultTerminal: defaultTerminalTheme,
  landingPage: landingPageTheme,
  landingPageLight: landingPageLightTheme,
};

const meta = {
  title: "Components/ThemedLogo",
  component: Logo,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Logo>;

export default meta;
type Story = StoryObj<typeof meta>;

const ThemedLogoDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState<string>("terminal");
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

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Logo
          width={300}
          height={300}
          color={theme.colors.primary}
          letterColor={theme.colors.text}
          particleColor={theme.colors.primary}
          horizontalColor={theme.colors.accent}
          verticalColor={theme.colors.accent}
          diagonalColor={theme.colors.accent}
          outlineColor={theme.colors.accent}
          axisColor={theme.colors.textSecondary}
          opacity={0.9}
        />

        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <ColorSwatch label="text" color={theme.colors.text} />
          <ColorSwatch label="primary" color={theme.colors.primary} />
          <ColorSwatch label="secondary" color={theme.colors.secondary} />
          <ColorSwatch label="accent" color={theme.colors.accent} />
          <ColorSwatch label="muted" color={theme.colors.muted} />
        </div>
      </div>
    </div>
  );
};

const ColorSwatch = ({ label, color }: { label: string; color: string }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: 4,
        backgroundColor: color,
        border: "1px solid rgba(255,255,255,0.2)",
      }}
    />
    <span style={{ fontSize: 10, color: "#888" }}>{label}</span>
  </div>
);

export const ThemePresets: Story = {
  render: () => <ThemedLogoDemo />,
  parameters: {
    layout: "fullscreen",
  },
};
