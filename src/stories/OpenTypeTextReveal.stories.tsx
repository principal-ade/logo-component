import type { Meta, StoryObj } from "@storybook/react";
import { OpenTypeTextReveal } from "../OpenTypeTextReveal";

// Font URLs from reliable CDNs
const FONTS = {
  // From cdnjs / jsdelivr
  roboto: "https://cdn.jsdelivr.net/fontsource/fonts/roboto@latest/latin-400-normal.ttf",
  robotoMono: "https://cdn.jsdelivr.net/fontsource/fonts/roboto-mono@latest/latin-400-normal.ttf",
  openSans: "https://cdn.jsdelivr.net/fontsource/fonts/open-sans@latest/latin-400-normal.ttf",
  inter: "https://cdn.jsdelivr.net/fontsource/fonts/inter@latest/latin-400-normal.ttf",
  montserrat: "https://cdn.jsdelivr.net/fontsource/fonts/montserrat@latest/latin-400-normal.ttf",
  sourceCodePro: "https://cdn.jsdelivr.net/fontsource/fonts/source-code-pro@latest/latin-400-normal.ttf",
  oswald: "https://cdn.jsdelivr.net/fontsource/fonts/oswald@latest/latin-400-normal.ttf",
  playfair: "https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-400-normal.ttf",
};

const meta = {
  title: "Components/OpenTypeTextReveal",
  component: OpenTypeTextReveal,
  parameters: {
    layout: "centered",
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#1a1a1a" },
        { name: "light", value: "#ffffff" },
        { name: "blue", value: "#0d1b2a" },
      ],
    },
  },
  tags: ["autodocs"],
  argTypes: {
    text: {
      control: "text",
      description: "The text to display",
    },
    fontUrl: {
      control: "select",
      options: Object.values(FONTS),
      description: "URL to the font file",
    },
    fontSize: {
      control: { type: "range", min: 24, max: 144, step: 4 },
      description: "Font size in pixels",
    },
    width: {
      control: { type: "range", min: 200, max: 1000, step: 20 },
      description: "Width of the component",
    },
    height: {
      control: { type: "range", min: 60, max: 400, step: 10 },
      description: "Height of the component",
    },
    centerText: {
      control: "boolean",
      description: "Center the text in the container",
    },
    chaosMode: {
      control: "select",
      options: ["none", "fragmented"],
      description: "Show fragmented assembly",
    },
    showChartIntro: {
      control: "boolean",
      description: "Show time-series chart intro (default: true when fragmented)",
    },
    chartPattern: {
      control: "select",
      options: ["latency", "cpu", "noise"],
      description: "Telemetry pattern style for chart intro",
    },
    chartDuration: {
      control: { type: "range", min: 0.5, max: 4, step: 0.25 },
      description: "Duration the chart is visible",
    },
    chartLineFadeDuration: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
      description: "Duration for chart lines to fade",
    },
    chartPauseDuration: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
      description: "Pause after lines fade",
    },
    chartTransitionDuration: {
      control: { type: "range", min: 0.3, max: 2, step: 0.1 },
      description: "Duration for dots to move to target positions",
    },
    dotsPerPathUnit: {
      control: { type: "range", min: 10, max: 200, step: 5 },
      description: "Pixels of path length per dot (lower = more dots)",
    },
    minDotsPerContour: {
      control: { type: "range", min: 1, max: 10, step: 1 },
      description: "Minimum dots per contour",
    },
    maxDotsPerContour: {
      control: { type: "range", min: 0, max: 50, step: 1 },
      description: "Maximum dots per contour (0 = unlimited)",
    },
    dotDistribution: {
      control: "select",
      options: ["even", "endpoints", "random"],
      description: "How dots are distributed along each contour",
    },
    chaosDuration: {
      control: { type: "range", min: 0.5, max: 5, step: 0.25 },
    },
    dotsDuration: {
      control: { type: "range", min: 0.3, max: 3, step: 0.1 },
    },
    flowDuration: {
      control: { type: "range", min: 0.5, max: 5, step: 0.25 },
    },
    flowDelay: {
      control: { type: "range", min: 0, max: 2, step: 0.1 },
    },
    particlesPerPath: {
      control: { type: "range", min: 1, max: 5, step: 1 },
    },
    particleRadius: {
      control: { type: "range", min: 1, max: 6, step: 0.5 },
    },
    color: {
      control: "color",
    },
    wordColors: {
      control: "object",
      description: "Colors for each word (space-separated). Falls back to color if not specified.",
    },
    particleColor: {
      control: "color",
    },
    strokeWidth: {
      control: { type: "range", min: 0.5, max: 4, step: 0.25 },
    },
    opacity: {
      control: { type: "range", min: 0, max: 1, step: 0.1 },
    },
    showGlow: {
      control: "boolean",
    },
    fadeAfterAssembly: {
      control: "boolean",
    },
    fadeOpacity: {
      control: { type: "range", min: 0.1, max: 1, step: 0.1 },
    },
    loop: {
      control: "boolean",
    },
    loopDelay: {
      control: { type: "range", min: 0, max: 3, step: 0.25 },
    },
  },
} satisfies Meta<typeof OpenTypeTextReveal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    text: "HELLO",
    fontUrl: FONTS.roboto,
    fontSize: 72,
    width: 400,
    height: 120,
    color: "#00ffff",
    particleColor: "#00ff88",
  },
};

export const PrincipalAI: Story = {
  name: "Principal AI",
  args: {
    text: "Principal AI",
    fontUrl: FONTS.inter,
    fontSize: 64,
    width: 550,
    height: 120,
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    dotsDuration: 1.5,
    flowDuration: 2,
    color: "#00ffff",
    particleColor: "#00ff88",
    loopDelay: 2,
  },
};

export const PrincipalAIPlayfair: Story = {
  name: "Principal AI (Playfair)",
  args: {
    text: "Principal AI",
    fontUrl: FONTS.playfair,
    fontSize: 64,
    width: 550,
    height: 130,
    chaosMode: "fragmented",
    chaosDuration: 2.5,
    color: "#4a9eff",
    particleColor: "#ffffff",
    strokeWidth: 1,
  },
};

export const MonospaceTelemetry: Story = {
  name: "Monospace Telemetry",
  args: {
    text: "TELEMETRY",
    fontUrl: FONTS.robotoMono,
    fontSize: 56,
    width: 550,
    height: 110,
    chaosMode: "fragmented",
    color: "#27ae60",
    particleColor: "#f1c40f",
  },
};

export const OswaldBold: Story = {
  name: "Oswald Bold",
  args: {
    text: "SIGNAL",
    fontUrl: FONTS.oswald,
    fontSize: 80,
    width: 400,
    height: 130,
    chaosMode: "fragmented",
    color: "#e74c3c",
    particleColor: "#f39c12",
    strokeWidth: 1.5,
  },
};

export const MontserratClean: Story = {
  name: "Montserrat",
  args: {
    text: "DATA FLOW",
    fontUrl: FONTS.montserrat,
    fontSize: 54,
    width: 500,
    height: 110,
    color: "#9b59b6",
    particleColor: "#e91e63",
    flowDuration: 2.5,
  },
};

export const SourceCodeNumbers: Story = {
  name: "Source Code Numbers",
  args: {
    text: "2024",
    fontUrl: FONTS.sourceCodePro,
    fontSize: 96,
    width: 350,
    height: 150,
    chaosMode: "fragmented",
    color: "#1abc9c",
    particleColor: "#3498db",
  },
};

export const FragmentedPlayfair: Story = {
  name: "Fragmented Elegant",
  args: {
    text: "Elegant",
    fontUrl: FONTS.playfair,
    fontSize: 72,
    width: 450,
    height: 130,
    chaosMode: "fragmented",
    chaosDuration: 3,
    dotsDuration: 2,
    color: "#ffffff",
    particleColor: "#ffd700",
    strokeWidth: 1,
  },
};

export const LargeText: Story = {
  args: {
    text: "BIG",
    fontUrl: FONTS.oswald,
    fontSize: 120,
    width: 400,
    height: 180,
    color: "#ffffff",
    strokeWidth: 2,
    particleRadius: 3,
  },
};

export const SmallText: Story = {
  args: {
    text: "tiny details",
    fontUrl: FONTS.inter,
    fontSize: 32,
    width: 300,
    height: 60,
    color: "#888888",
    particleColor: "#ffffff",
    strokeWidth: 0.75,
    particleRadius: 1.5,
  },
};

export const NoLoop: Story = {
  args: {
    text: "ONCE",
    fontUrl: FONTS.roboto,
    fontSize: 72,
    width: 300,
    height: 120,
    color: "#00ffff",
    loop: false,
  },
};

export const MultipleParticles: Story = {
  args: {
    text: "FLOW",
    fontUrl: FONTS.montserrat,
    fontSize: 80,
    width: 350,
    height: 130,
    particlesPerPath: 3,
    flowDuration: 3,
    color: "#ff6b6b",
    particleColor: "#feca57",
  },
};

export const SlowDramatic: Story = {
  name: "Slow Dramatic Reveal",
  args: {
    text: "REVEAL",
    fontUrl: FONTS.playfair,
    fontSize: 72,
    width: 450,
    height: 140,
    chaosMode: "fragmented",
    chaosDuration: 4,
    dotsDuration: 2.5,
    flowDuration: 3,
    flowDelay: 0.5,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 2,
  },
};

export const OnLightBackground: Story = {
  args: {
    text: "LIGHT",
    fontUrl: FONTS.inter,
    fontSize: 72,
    width: 350,
    height: 120,
    color: "#333333",
    particleColor: "#0066cc",
  },
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const OpenSansNatural: Story = {
  name: "Open Sans",
  args: {
    text: "Natural",
    fontUrl: FONTS.openSans,
    fontSize: 64,
    width: 400,
    height: 110,
    chaosMode: "fragmented",
    color: "#2ecc71",
    particleColor: "#ffffff",
  },
};

// Chart Intro Pattern Stories
export const ChartIntroLatency: Story = {
  name: "Chart Intro: Latency Pattern",
  args: {
    text: "TELEMETRY",
    fontUrl: FONTS.robotoMono,
    fontSize: 48,
    width: 500,
    height: 120,
    chaosMode: "fragmented",
    chartPattern: "latency",
    chartDuration: 2,
    chaosDuration: 2,
    color: "#00ffff",
    particleColor: "#00ff88",
    loopDelay: 1.5,
  },
};

export const ChartIntroCPU: Story = {
  name: "Chart Intro: CPU Pattern",
  args: {
    text: "METRICS",
    fontUrl: FONTS.robotoMono,
    fontSize: 52,
    width: 450,
    height: 120,
    chaosMode: "fragmented",
    chartPattern: "cpu",
    chartDuration: 2,
    chaosDuration: 2,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 1.5,
  },
};

export const ChartIntroNoise: Story = {
  name: "Chart Intro: Noise Pattern",
  args: {
    text: "SIGNAL",
    fontUrl: FONTS.oswald,
    fontSize: 64,
    width: 400,
    height: 130,
    chaosMode: "fragmented",
    chartPattern: "noise",
    chartDuration: 2,
    chaosDuration: 2,
    color: "#e74c3c",
    particleColor: "#f39c12",
    loopDelay: 1.5,
  },
};

export const ChartIntroDisabled: Story = {
  name: "Chart Intro: Disabled",
  args: {
    text: "NO CHART",
    fontUrl: FONTS.inter,
    fontSize: 56,
    width: 400,
    height: 120,
    chaosMode: "fragmented",
    showChartIntro: false,
    color: "#9b59b6",
    particleColor: "#e91e63",
  },
};

export const ChartIntroSimple: Story = {
  name: "Chart Intro: Simple (No Fragmented)",
  args: {
    text: "SIMPLE",
    fontUrl: FONTS.montserrat,
    fontSize: 64,
    width: 400,
    height: 130,
    chaosMode: "none",
    showChartIntro: true,
    chartPattern: "cpu",
    chartDuration: 2,
    color: "#1abc9c",
    particleColor: "#3498db",
  },
};

// Dot Distribution Stories
export const DenseDotsEven: Story = {
  name: "Dense Dots: Even Distribution",
  args: {
    text: "DENSE",
    fontUrl: FONTS.oswald,
    fontSize: 72,
    width: 350,
    height: 130,
    chaosMode: "fragmented",
    dotsPerPathUnit: 15,
    dotDistribution: "even",
    chartPattern: "latency",
    chartDuration: 2,
    color: "#00ffff",
    particleColor: "#00ff88",
    loopDelay: 1.5,
  },
};

export const DenseDotsEndpoints: Story = {
  name: "Dense Dots: Endpoints Distribution",
  args: {
    text: "CLUSTER",
    fontUrl: FONTS.montserrat,
    fontSize: 56,
    width: 450,
    height: 120,
    chaosMode: "fragmented",
    dotsPerPathUnit: 20,
    dotDistribution: "endpoints",
    chartPattern: "cpu",
    chartDuration: 2,
    color: "#4a9eff",
    particleColor: "#ffffff",
    loopDelay: 1.5,
  },
};

export const DenseDotsRandom: Story = {
  name: "Dense Dots: Random Distribution",
  args: {
    text: "CHAOS",
    fontUrl: FONTS.playfair,
    fontSize: 72,
    width: 400,
    height: 130,
    chaosMode: "fragmented",
    dotsPerPathUnit: 25,
    dotDistribution: "random",
    chartPattern: "noise",
    chartDuration: 2,
    color: "#e74c3c",
    particleColor: "#f39c12",
    loopDelay: 1.5,
  },
};

export const SparseDots: Story = {
  name: "Sparse Dots (Original Behavior)",
  args: {
    text: "SPARSE",
    fontUrl: FONTS.inter,
    fontSize: 64,
    width: 400,
    height: 120,
    chaosMode: "fragmented",
    dotsPerPathUnit: 200,
    minDotsPerContour: 1,
    chartPattern: "latency",
    chartDuration: 2,
    color: "#9b59b6",
    particleColor: "#e91e63",
    loopDelay: 1.5,
  },
};

export const MaxDotsLimited: Story = {
  name: "Max Dots Limited",
  args: {
    text: "LIMITED",
    fontUrl: FONTS.robotoMono,
    fontSize: 52,
    width: 450,
    height: 110,
    chaosMode: "fragmented",
    dotsPerPathUnit: 10,
    maxDotsPerContour: 3,
    dotDistribution: "even",
    chartPattern: "cpu",
    chartDuration: 2,
    color: "#1abc9c",
    particleColor: "#3498db",
    loopDelay: 1.5,
  },
};

// Multi-word color stories
export const PrincipalAITwoColors: Story = {
  name: "Principal AI: Two Colors",
  args: {
    text: "Principal AI",
    fontUrl: FONTS.inter,
    fontSize: 64,
    width: 550,
    height: 120,
    chaosMode: "fragmented",
    dotsPerPathUnit: 25,
    wordColors: ["#00ffff", "#ff6b6b"],
    chartPattern: "latency",
    chartDuration: 2,
    loopDelay: 1.5,
  },
};

export const PrincipalAIDenseColors: Story = {
  name: "Principal AI: Dense Two Colors",
  args: {
    text: "Principal AI",
    fontUrl: FONTS.inter,
    fontSize: 64,
    width: 550,
    height: 120,
    chaosMode: "fragmented",
    dotsPerPathUnit: 15,
    wordColors: ["#4a9eff", "#f39c12"],
    chartPattern: "cpu",
    chartDuration: 2.5,
    loopDelay: 1.5,
  },
};

export const ThreeWordColors: Story = {
  name: "Three Word Colors",
  args: {
    text: "Story Based Monitoring",
    fontUrl: FONTS.montserrat,
    fontSize: 48,
    width: 600,
    height: 110,
    chaosMode: "fragmented",
    dotsPerPathUnit: 20,
    wordColors: ["#e74c3c", "#2ecc71", "#3498db"],
    chartPattern: "noise",
    chartDuration: 2,
    loopDelay: 1.5,
  },
};

export const MultiWordCPUPattern: Story = {
  name: "Multi-Word: CPU Pattern",
  args: {
    text: "System Metrics",
    fontUrl: FONTS.robotoMono,
    fontSize: 52,
    width: 500,
    height: 120,
    chaosMode: "fragmented",
    dotsPerPathUnit: 20,
    wordColors: ["#1abc9c", "#9b59b6"],
    chartPattern: "cpu",
    chartDuration: 2,
    loopDelay: 1.5,
  },
};
