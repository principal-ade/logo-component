import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { FileCityLogoAnimated } from "../FileCityLogoAnimated";
import { iceTangerineDarkTheme } from "@principal-ade/industry-theme";

const defaultTheme = iceTangerineDarkTheme;

const meta = {
  title: "Components/FileCityLogoAnimated",
  component: FileCityLogoAnimated,
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
} satisfies Meta<typeof FileCityLogoAnimated>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The heatmap reveal: batches of 5–10 cells get sampled each tick (with a
 *  border flagging the active batch) until the summed weights resolve into
 *  the P. Plays once and holds. */
export const Default: Story = {
  args: {
    theme: defaultTheme,
    mark: "P",
    width: 220,
    height: 220,
  },
};

/** A replay button so you can watch the build-up repeatedly. */
export const Replay: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    return (
      <div style={{ textAlign: "center" }}>
        <FileCityLogoAnimated
          theme={defaultTheme}
          mark="P"
          width={240}
          height={240}
          playKey={key}
        />
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            marginTop: 16,
            padding: "8px 18px",
            borderRadius: 6,
            border: `1px solid ${defaultTheme.colors.primary}`,
            background: defaultTheme.colors.backgroundSecondary,
            color: defaultTheme.colors.text,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Replay
        </button>
      </div>
    );
  },
};

/** Connector lines that thread each group's cells as they reveal, then
 *  fade out during the pause — vs. the plain reveal. */
export const Connectors: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 32, justifyContent: "center" }}>
          <div style={{ textAlign: "center" }}>
            <FileCityLogoAnimated
              theme={defaultTheme}
              mark="P"
              width={200}
              height={200}
              connectors
              playKey={key}
            />
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>connectors</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <FileCityLogoAnimated
              theme={defaultTheme}
              mark="P"
              width={200}
              height={200}
              connectors={false}
              playKey={key}
            />
            <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>no connectors</div>
          </div>
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            marginTop: 16,
            padding: "8px 18px",
            borderRadius: 6,
            border: `1px solid ${defaultTheme.colors.primary}`,
            background: defaultTheme.colors.backgroundSecondary,
            color: defaultTheme.colors.text,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Replay both
        </button>
      </div>
    );
  },
};

/** Trail (connector) color comparison — the same build, with the connector
 *  bound to each candidate theme color so you can pick one. */
export const TrailColors: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    const options = [
      { label: "accent", color: defaultTheme.colors.accent },
      { label: "highlight", color: defaultTheme.colors.highlight },
      { label: "primary", color: defaultTheme.colors.primary },
      { label: "info", color: defaultTheme.colors.info },
    ];
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          {options.map((o) => (
            <div key={o.label} style={{ textAlign: "center" }}>
              <FileCityLogoAnimated
                theme={defaultTheme}
                mark="P"
                width={180}
                height={180}
                connectors
                connectorColor={o.color}
                playKey={key}
              />
              <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                {o.label}
                <span style={{ color: "#666" }}> · {o.color}</span>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            marginTop: 16,
            padding: "8px 18px",
            borderRadius: 6,
            border: `1px solid ${defaultTheme.colors.primary}`,
            background: defaultTheme.colors.backgroundSecondary,
            color: defaultTheme.colors.text,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Replay all
        </button>
      </div>
    );
  },
};

/** Each mark, animated. */
export const Marks: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
      {(["P", "AI", "PAI", "lockup"] as const).map((m) => (
        <div key={m} style={{ textAlign: "center" }}>
          <FileCityLogoAnimated theme={defaultTheme} mark={m} width={160} height={160} />
          <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>mark="{m}"</div>
        </div>
      ))}
    </div>
  ),
};

/** Timing knobs — faster/slower ticks and bigger/smaller batches. */
export const Pacing: Story = {
  render: () => {
    const [key, setKey] = useState(0);
    const Cell = ({
      label,
      cellMs,
      pauseMs,
      batchMin,
      batchMax,
    }: {
      label: string;
      cellMs: number;
      pauseMs: number;
      batchMin: number;
      batchMax: number;
    }) => (
      <div style={{ textAlign: "center" }}>
        <FileCityLogoAnimated
          theme={defaultTheme}
          mark="P"
          width={160}
          height={160}
          cellMs={cellMs}
          pauseMs={pauseMs}
          batchMin={batchMin}
          batchMax={batchMax}
          playKey={key}
        />
        <div style={{ color: "#888", fontSize: 12, marginTop: 4 }}>{label}</div>
      </div>
    );
    return (
      <div style={{ textAlign: "center" }}>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "center" }}>
          <Cell label="long pauses" cellMs={185} pauseMs={1150} batchMin={2} batchMax={4} />
          <Cell label="default (185ms / 900ms)" cellMs={185} pauseMs={900} batchMin={3} batchMax={6} />
          <Cell label="brisk" cellMs={80} pauseMs={420} batchMin={4} batchMax={7} />
        </div>
        <button
          onClick={() => setKey((k) => k + 1)}
          style={{
            marginTop: 16,
            padding: "8px 18px",
            borderRadius: 6,
            border: `1px solid ${defaultTheme.colors.primary}`,
            background: defaultTheme.colors.backgroundSecondary,
            color: defaultTheme.colors.text,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Replay all
        </button>
      </div>
    );
  },
};
