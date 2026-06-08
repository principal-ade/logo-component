import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TrailCityBanner, type BannerVariant } from "../TrailCityBanner";
import { TrailMarketingBanner } from "../TrailMarketingBanner";
import {
  landingPageTheme,
  iceTangerineTheme,
  iceTangerineDarkTheme,
  type Theme,
} from "@principal-ade/industry-theme";

// Flip this one constant to retheme every banner story.
const BANNER_THEME: Theme = iceTangerineTheme;
// Kept imported as the easy alternate to switch back to.
void landingPageTheme;

// The wordmark surfaces (LinkedIn company cover + X/Twitter header) spell the
// text (the wide cousin of FileCityLogo's "P") out of the city, on the
// iceTangerineDark palette — the same dark palette the LinkedIn profile
// background (TrailMarketingBanner) rides, so the set reads together.
const WORDMARK_THEME: Theme = iceTangerineDarkTheme;
const WORDMARK_TEXT = "CODE TRAILS";

/**
 * Social banner shape studies.
 *
 * These stories are NOT the finished banner art. They exist to capture the
 * *shape* of each platform's banner and show how a (square) TrailCityDiagram
 * has to live inside a very wide, very short frame — plus where each platform
 * drops its own chrome (logo / avatar / name) on top.
 *
 * Two target surfaces:
 *   • X / Twitter company header     — 1500 × 500  (3:1)
 *   • LinkedIn company page cover     — 1128 × 191  (~5.9:1)
 *
 * Safe-zone numbers below are approximate and should be sanity-checked against
 * the live layouts before final art — platforms tweak crops often.
 */

// ---------------------------------------------------------------------------
// Banner specs
// ---------------------------------------------------------------------------

interface BannerSpec {
  /** Human label for the caption. */
  name: string;
  /** Matching TrailCityBanner preset. */
  variant: BannerVariant;
  /** Native export dimensions. */
  w: number;
  h: number;
  /** Aspect / file notes for the caption. */
  note: string;
  /**
   * Region the platform covers with its own chrome (logo/avatar) — keep key
   * art clear of this. Coordinates are in native banner pixels.
   */
  logoSafe: { x: number; y: number; w: number; h: number };
  /** Label for the logo-safe region. */
  logoLabel: string;
}

const TWITTER: BannerSpec = {
  name: "X / Twitter — company header",
  variant: "twitterHeader",
  w: 1500,
  h: 500,
  note: "3:1 · 1500×500 · max 2 MB · JPG/PNG/GIF",
  // Circular avatar overlaps bottom-left, ~ and the bottom band can be hidden
  // behind the name/bio card on some surfaces.
  logoSafe: { x: 0, y: 320, w: 420, h: 180 },
  logoLabel: "avatar + name overlay",
};

const LINKEDIN: BannerSpec = {
  name: "LinkedIn — company page cover",
  variant: "linkedinCompany",
  w: 1128,
  h: 191,
  note: "~5.9:1 · 1128×191 · max 8 MB · crops on mobile",
  // Company logo square overlaps the lower-left of the cover on the page.
  logoSafe: { x: 0, y: 70, w: 260, h: 121 },
  logoLabel: "company logo",
};

const LINKEDIN_PROFILE: BannerSpec = {
  name: "LinkedIn — employee profile background",
  variant: "linkedinProfile",
  w: 1584,
  h: 396,
  note: "4:1 · 1584×396 · max 8 MB · personal profile",
  // Circular profile photo + name/headline card straddle the lower-left.
  logoSafe: { x: 24, y: 232, w: 320, h: 164 },
  logoLabel: "profile photo + name",
};

// Render scales so each frame fits a normal screen while we keep the native
// pixel dimensions in the data (and the caption).
const SCALE: Record<string, number> = {
  twitter: 0.72, // 1500 -> 1080
  linkedin: 0.9, // 1128 -> ~1015
  linkedinProfile: 0.66, // 1584 -> ~1045
};

// ---------------------------------------------------------------------------
// Frame + overlays
// ---------------------------------------------------------------------------

/** A dimensioned, scaled banner frame that clips whatever art is dropped in. */
function BannerFrame({
  spec,
  scale,
  theme,
  showGuides = true,
  children,
}: {
  spec: BannerSpec;
  scale: number;
  theme: Theme;
  showGuides?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure style={{ margin: 0, display: "inline-block" }}>
      <div
        style={{
          width: spec.w * scale,
          height: spec.h * scale,
          position: "relative",
          overflow: "hidden",
          borderRadius: 8,
          boxShadow: "0 1px 0 rgba(255,255,255,0.06), 0 18px 40px rgba(0,0,0,0.5)",
          background: theme.colors.background,
        }}
      >
        {/* Native-resolution art layer, scaled down as one unit. */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: spec.w,
            height: spec.h,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
          {showGuides && <SafeZoneOverlay spec={spec} />}
        </div>
      </div>
      <figcaption
        style={{
          marginTop: 10,
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 12,
          color: "#8a93a3",
        }}
      >
        {spec.name} — <strong style={{ color: "#c9d2e0" }}>{spec.note}</strong>
      </figcaption>
    </figure>
  );
}

/** Margin + logo-safe-zone guides drawn in native banner coordinates. */
function SafeZoneOverlay({ spec }: { spec: BannerSpec }) {
  const margin = Math.round(spec.h * 0.08); // keep key art off the edges
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {/* outer safe margin */}
      <div
        style={{
          position: "absolute",
          inset: margin,
          border: "2px dashed rgba(0,0,0,0.45)",
          borderRadius: 4,
        }}
      />
      {/* center line — helps keep content vertically centered (mobile crops) */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: spec.h / 2,
          borderTop: "1px dashed rgba(0,0,0,0.3)",
        }}
      />
      {/* logo / avatar keep-clear region */}
      <div
        style={{
          position: "absolute",
          left: spec.logoSafe.x,
          top: spec.logoSafe.y,
          width: spec.logoSafe.w,
          height: spec.logoSafe.h,
          background:
            "repeating-linear-gradient(-45deg, rgba(244,114,91,0.16) 0 12px, rgba(244,114,91,0.06) 12px 24px)",
          border: "2px solid rgba(244,114,91,0.55)",
          display: "flex",
          alignItems: "flex-end",
          padding: 8,
          boxSizing: "border-box",
        }}
      >
        <span
          style={{
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            fontSize: 13,
            color: "#f4725b",
            fontWeight: 600,
          }}
        >
          {spec.logoLabel} — keep clear
        </span>
      </div>
    </div>
  );
}

/**
 * The real banner art — TrailCityBanner sized to the frame's preset. Fills the
 * frame edge to edge (the component's own viewBox matches the native size).
 */
function BannerArt({
  spec,
  theme,
  wordmark,
}: {
  spec: BannerSpec;
  theme: Theme;
  /** When set, the city spells this text instead of a random skyline. */
  wordmark?: string;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, lineHeight: 0 }}>
      <TrailCityBanner variant={spec.variant} theme={theme} wordmark={wordmark} />
    </div>
  );
}

/** Marketing-OG-card style art (navy + footprints + headline). */
const PROFILE_BG = "#0d274d"; // OG card navy
function MarketingArt({
  variant = "linkedinProfile",
}: {
  variant?: "linkedinProfile" | "twitterHeader" | "linkedinCompany";
}) {
  return (
    <div style={{ position: "absolute", inset: 0, lineHeight: 0 }}>
      <TrailMarketingBanner variant={variant} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

const meta = {
  title: "Social/Banners",
  parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj;

const pageWrap = (children: React.ReactNode, bg = "#0b0f14"): React.ReactNode => (
  <div
    style={{
      background: bg,
      padding: 40,
      minHeight: "100vh",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 32,
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// Shape-study stories (frame + guides)
// ---------------------------------------------------------------------------

/** X / Twitter company header — dark theme, city spelling the wordmark
 *  (CODE TRAILS), with safe-zone guides. */
export const TwitterHeader: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <BannerFrame spec={TWITTER} scale={SCALE.twitter} theme={WORDMARK_THEME}>
        <BannerArt spec={TWITTER} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
      </BannerFrame>,
    ),
};

/** LinkedIn company page cover — dark theme, with the city spelling the
 *  wordmark (CODE TRAILS) the same way FileCityLogo's city spells a "P". */
export const LinkedInCompanyCover: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <BannerFrame spec={LINKEDIN} scale={SCALE.linkedin} theme={WORDMARK_THEME}>
        <BannerArt spec={LINKEDIN} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
      </BannerFrame>,
    ),
};

/** LinkedIn employee/personal profile background — marketing OG-card style. */
export const LinkedInProfileBackground: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <BannerFrame
        spec={LINKEDIN_PROFILE}
        scale={SCALE.linkedinProfile}
        theme={BANNER_THEME}
      >
        <MarketingArt />
      </BannerFrame>,
    ),
};

/** Both target frames stacked so the difference in shape is obvious. */
export const ShapeComparison: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <>
        <BannerFrame spec={TWITTER} scale={SCALE.twitter} theme={WORDMARK_THEME}>
          <BannerArt spec={TWITTER} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
        <BannerFrame spec={LINKEDIN} scale={SCALE.twitter} theme={WORDMARK_THEME}>
          <BannerArt spec={LINKEDIN} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
      </>,
    ),
};

/** Clean export preview — no guides — to judge the art itself. */
export const NoGuides: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <>
        <BannerFrame
          spec={TWITTER}
          scale={SCALE.twitter}
          theme={WORDMARK_THEME}
          showGuides={false}
        >
          <BannerArt spec={TWITTER} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
        <BannerFrame
          spec={LINKEDIN}
          scale={SCALE.linkedin}
          theme={WORDMARK_THEME}
          showGuides={false}
        >
          <BannerArt spec={LINKEDIN} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
      </>,
    ),
};

// ---------------------------------------------------------------------------
// In-context mockups (faux platform chrome)
// ---------------------------------------------------------------------------

/** The X header sitting in a faux company profile, avatar overlapping it. */
export const TwitterInContext: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const scale = SCALE.twitter;
    const w = TWITTER.w * scale;
    return pageWrap(
      <div style={{ width: w, color: "#e7e9ea", fontFamily: "system-ui, sans-serif" }}>
        <BannerFrame spec={TWITTER} scale={scale} theme={WORDMARK_THEME} showGuides={false}>
          <BannerArt spec={TWITTER} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
        {/* profile row */}
        <div style={{ position: "relative", padding: "0 16px" }}>
          <div
            style={{
              position: "absolute",
              top: -48,
              left: 16,
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: WORDMARK_THEME.colors.background,
              border: "4px solid #0b0f14",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12 }}>
            <button
              style={{
                background: "#eff3f4",
                color: "#0f1419",
                border: "none",
                borderRadius: 999,
                padding: "8px 18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Follow
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Principal AI</div>
            <div style={{ color: "#71767b" }}>@principal_ai</div>
          </div>
        </div>
      </div>,
      "#000000",
    );
  },
};

/** X / Twitter header in the marketing OG-card style, with safe-zone guides. */
export const TwitterHeaderMarketing: Story = {
  parameters: { layout: "fullscreen" },
  render: () =>
    pageWrap(
      <BannerFrame spec={TWITTER} scale={SCALE.twitter} theme={BANNER_THEME}>
        <MarketingArt variant="twitterHeader" />
      </BannerFrame>,
    ),
};

/** The marketing-style X header in a faux company profile. */
export const TwitterMarketingInContext: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const scale = SCALE.twitter;
    const w = TWITTER.w * scale;
    return pageWrap(
      <div style={{ width: w, color: "#e7e9ea", fontFamily: "system-ui, sans-serif" }}>
        <BannerFrame spec={TWITTER} scale={scale} theme={BANNER_THEME} showGuides={false}>
          <MarketingArt variant="twitterHeader" />
        </BannerFrame>
        <div style={{ position: "relative", padding: "0 16px" }}>
          <div
            style={{
              position: "absolute",
              top: -48,
              left: 16,
              width: 96,
              height: 96,
              borderRadius: "50%",
              background: PROFILE_BG,
              border: "4px solid #0b0f14",
              boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)",
            }}
          />
          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 12 }}>
            <button
              style={{
                background: "#eff3f4",
                color: "#0f1419",
                border: "none",
                borderRadius: 999,
                padding: "8px 18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Follow
            </button>
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 20, fontWeight: 800 }}>Principal AI</div>
            <div style={{ color: "#71767b" }}>@principal_ai</div>
          </div>
        </div>
      </div>,
      "#000000",
    );
  },
};

/** The LinkedIn cover sitting in a faux company page, logo overlapping it. */
export const LinkedInInContext: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const scale = SCALE.linkedin;
    const w = LINKEDIN.w * scale;
    return pageWrap(
      <div
        style={{
          width: w,
          background: "#ffffff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          color: "#1d2226",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <BannerFrame spec={LINKEDIN} scale={scale} theme={WORDMARK_THEME} showGuides={false}>
          <BannerArt spec={LINKEDIN} theme={WORDMARK_THEME} wordmark={WORDMARK_TEXT} />
        </BannerFrame>
        <div style={{ position: "relative", padding: "0 24px 24px" }}>
          <div
            style={{
              position: "absolute",
              top: -52,
              left: 24,
              width: 104,
              height: 104,
              borderRadius: 12,
              background: WORDMARK_THEME.colors.background,
              border: "4px solid #ffffff",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
            }}
          />
          <div style={{ paddingTop: 64 }}>
            <div style={{ fontSize: 22, fontWeight: 700 }}>Principal AI</div>
            <div style={{ color: "#56687a", marginTop: 2 }}>
              Code understanding for teams · Developer Tools
            </div>
            <button
              style={{
                marginTop: 12,
                background: "#0a66c2",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "6px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Follow
            </button>
          </div>
        </div>
      </div>,
      "#f4f2ee",
    );
  },
};

/** The personal profile background in a faux employee profile page —
 *  circular photo + name card straddling the lower-left of the banner. */
export const LinkedInProfileInContext: Story = {
  parameters: { layout: "fullscreen" },
  render: () => {
    const scale = SCALE.linkedinProfile;
    const w = LINKEDIN_PROFILE.w * scale;
    return pageWrap(
      <div
        style={{
          width: w,
          background: "#ffffff",
          borderRadius: 8,
          overflow: "hidden",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          color: "#1d2226",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <BannerFrame
          spec={LINKEDIN_PROFILE}
          scale={scale}
          theme={BANNER_THEME}
          showGuides={false}
        >
          <MarketingArt />
        </BannerFrame>
        <div style={{ position: "relative", padding: "0 24px 24px" }}>
          {/* circular profile photo overlapping the banner, lower-left */}
          <div
            style={{
              position: "absolute",
              top: -88,
              left: 24,
              width: 152,
              height: 152,
              borderRadius: "50%",
              background: PROFILE_BG,
              border: "4px solid #ffffff",
              boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
            }}
          />
          <div style={{ paddingTop: 76 }}>
            <div style={{ fontSize: 26, fontWeight: 700 }}>Jordan Rivera</div>
            <div style={{ color: "#1d2226", marginTop: 2, fontSize: 15 }}>
              Staff Engineer at Principal AI · Code understanding & developer tools
            </div>
            <div style={{ color: "#56687a", marginTop: 2, fontSize: 13 }}>
              San Francisco, California · 500+ connections
            </div>
            <button
              style={{
                marginTop: 12,
                background: "#0a66c2",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "6px 20px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Connect
            </button>
          </div>
        </div>
      </div>,
      "#f4f2ee",
    );
  },
};
