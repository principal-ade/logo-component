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
  iceTangerineTheme,
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
  iceTangerine: iceTangerineTheme,
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
        backgroundColor: "#ffffff",
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
          particleColor={theme.colors.accent}
          horizontalColor={theme.colors.primary}
          verticalColor={theme.colors.primary}
          diagonalColor={theme.colors.primary}
          outlineColor={theme.colors.primary}
          axisColor={theme.colors.background}
          backgroundColor="#ffffff"
          useTextLetter={true}
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

const fonts = [
  // Serif
  { name: "Georgia", family: "Georgia, serif" },
  { name: "Palatino", family: "Palatino Linotype, Palatino, serif" },
  { name: "Times", family: "Times New Roman, Times, serif" },
  { name: "Garamond", family: "Garamond, serif" },
  { name: "Baskerville", family: "Baskerville, serif" },
  { name: "Didot", family: "Didot, serif" },
  { name: "Bodoni", family: "Bodoni MT, serif" },
  { name: "Bookman", family: "Bookman Old Style, serif" },
  { name: "Cambria", family: "Cambria, serif" },
  { name: "Cochin", family: "Cochin, serif" },
  { name: "Hoefler", family: "Hoefler Text, serif" },
  { name: "Rockwell", family: "Rockwell, serif" },
  { name: "Perpetua", family: "Perpetua, serif" },
  { name: "Big Caslon", family: "Big Caslon, serif" },
  // Sans-serif
  { name: "Helvetica", family: "Helvetica Neue, Helvetica, sans-serif" },
  { name: "Arial", family: "Arial, sans-serif" },
  { name: "Futura", family: "Futura, sans-serif" },
  { name: "Avenir", family: "Avenir, sans-serif" },
  { name: "Gill Sans", family: "Gill Sans, sans-serif" },
  { name: "Optima", family: "Optima, sans-serif" },
  { name: "Verdana", family: "Verdana, sans-serif" },
  { name: "Trebuchet", family: "Trebuchet MS, sans-serif" },
  { name: "Tahoma", family: "Tahoma, sans-serif" },
  { name: "Lucida Grande", family: "Lucida Grande, sans-serif" },
  { name: "Century Gothic", family: "Century Gothic, sans-serif" },
  { name: "Segoe UI", family: "Segoe UI, sans-serif" },
  { name: "San Francisco", family: "-apple-system, BlinkMacSystemFont, sans-serif" },
  { name: "Roboto", family: "Roboto, sans-serif" },
  // Display/Decorative
  { name: "Copperplate", family: "Copperplate, fantasy" },
  { name: "Papyrus", family: "Papyrus, fantasy" },
  { name: "Brush Script", family: "Brush Script MT, cursive" },
  { name: "Impact", family: "Impact, sans-serif" },
  { name: "Comic Sans", family: "Comic Sans MS, cursive" },
  // Monospace
  { name: "Courier", family: "Courier New, monospace" },
  { name: "Monaco", family: "Monaco, monospace" },
  { name: "Menlo", family: "Menlo, monospace" },
  { name: "Consolas", family: "Consolas, monospace" },
];

const FontSwitcherDemo = () => {
  const [selectedFont, setSelectedFont] = useState(fonts[0]);
  const theme = iceTangerineTheme;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 24,
        padding: 32,
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <h2 style={{ color: theme.colors.text, margin: 0, fontFamily: "system-ui" }}>
        Ice Tangerine - Font Switcher
      </h2>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          justifyContent: "center",
          maxWidth: 600,
        }}
      >
        {fonts.map((font) => (
          <button
            key={font.name}
            onClick={() => setSelectedFont(font)}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: selectedFont.name === font.name ? "2px solid" : "1px solid",
              borderColor:
                selectedFont.name === font.name
                  ? theme.colors.primary
                  : theme.colors.border,
              backgroundColor:
                selectedFont.name === font.name
                  ? theme.colors.primary
                  : theme.colors.backgroundSecondary,
              color:
                selectedFont.name === font.name
                  ? theme.colors.textOnPrimary
                  : theme.colors.text,
              cursor: "pointer",
              fontSize: 12,
              fontFamily: font.family,
              fontWeight: selectedFont.name === font.name ? 600 : 400,
              transition: "all 0.2s ease",
            }}
          >
            {font.name}
          </button>
        ))}
      </div>

      <Logo
        width={300}
        height={300}
        color={theme.colors.primary}
        letterColor={theme.colors.text}
        particleColor={theme.colors.accent}
        horizontalColor={theme.colors.primary}
        verticalColor={theme.colors.primary}
        diagonalColor={theme.colors.primary}
        outlineColor={theme.colors.primary}
        backgroundColor="#ffffff"
        useTextLetter={true}
        letterFontFamily={selectedFont.family}
        opacity={0.9}
      />

      <p style={{ color: theme.colors.muted, fontSize: 14, fontFamily: selectedFont.family }}>
        Current font: {selectedFont.name}
      </p>
    </div>
  );
};

export const FontSwitcher: Story = {
  render: () => <FontSwitcherDemo />,
  parameters: {
    layout: "fullscreen",
  },
};

export const IceTangerineInverted: Story = {
  render: () => (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 32,
        backgroundColor: iceTangerineTheme.colors.text,
        minHeight: "100vh",
        minWidth: "100vw",
        boxSizing: "border-box",
      }}
    >
      <Logo
        width={300}
        height={300}
        color={iceTangerineTheme.colors.primary}
        letterColor={iceTangerineTheme.colors.muted}
        particleColor={iceTangerineTheme.colors.muted}
        horizontalColor={iceTangerineTheme.colors.primary}
        verticalColor={iceTangerineTheme.colors.primary}
        diagonalColor={iceTangerineTheme.colors.primary}
        outlineColor={iceTangerineTheme.colors.primary}
        backgroundColor={iceTangerineTheme.colors.text}
        opacity={0.9}
      />
    </div>
  ),
  parameters: {
    layout: "fullscreen",
  },
};
