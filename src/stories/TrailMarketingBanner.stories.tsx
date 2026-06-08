import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { TrailMarketingBanner } from "../TrailMarketingBanner";

const meta = {
  title: "Components/TrailMarketingBanner",
  component: TrailMarketingBanner,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "inline-radio",
      options: ["linkedinProfile", "twitterHeader", "linkedinCompany"],
    },
    headline: { control: "text" },
    tagline: { control: "text" },
    filename: { control: "text" },
    byline: { control: "text" },
  },
} satisfies Meta<typeof TrailMarketingBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** LinkedIn employee/profile background — the web-ade marketing OG card look. */
export const LinkedInProfile: Story = {
  args: { variant: "linkedinProfile" },
  render: (args) => (
    <div style={{ width: 1056, maxWidth: "94vw" }}>
      <TrailMarketingBanner {...args} />
    </div>
  ),
};

/** Same card, X / Twitter header proportions. */
export const TwitterHeader: Story = {
  args: { variant: "twitterHeader" },
  render: (args) => (
    <div style={{ width: 1000, maxWidth: "94vw" }}>
      <TrailMarketingBanner {...args} />
    </div>
  ),
};

/** Custom copy. */
export const CustomCopy: Story = {
  args: {
    variant: "linkedinProfile",
    headline: "Jordan Rivera",
    tagline: "Staff Engineer at Principal AI",
    filename: "profile.ts",
    byline: "Principal AI",
  },
  render: (args) => (
    <div style={{ width: 1056, maxWidth: "94vw" }}>
      <TrailMarketingBanner {...args} />
    </div>
  ),
};
