# CLAUDE.md

Guidance for working in this repository.

## Git workflow

- **Never create branches.** Commit directly to `main`. This explicitly
  overrides any default "branch first when on the default branch" behavior —
  we do not want feature branches, ever.
- Only commit or push when asked.

## Banners

- `npm run export-banner` renders the social banners to `exports/banners/`
  (PNG @1x/@2x + SVG). Add `-- --style marketing` for the navy OG-card style
  (`TrailMarketingBanner`); the default style is the ice-tangerine trail city
  (`TrailCityBanner`). See `scripts/export-banner.js` for flags.
- Storybook (`npm run storybook`) has the banner components and the
  in-context social mockups under `Components/*` and `Social/Banners`.
