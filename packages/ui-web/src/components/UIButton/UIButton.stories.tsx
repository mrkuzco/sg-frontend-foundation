import type { Meta, StoryObj } from "@storybook/react-vite";
import { UIButton } from "./UIButton";
import { IconArrowForward, IconAdd } from "@sg-foundation/icons";

const meta: Meta<typeof UIButton> = {
  title: "Components/UIButton",
  component: UIButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: {
      control: "select",
      options: ["lg", "sm"],
    },
    floating: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UIButton>;

export const Default: Story = {
  args: {
    variant: "primary",
    size: "lg",
    children: "Button label",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton variant="primary">Primary</UIButton>
      <UIButton variant="secondary">Secondary</UIButton>
      <UIButton variant="tertiary">Tertiary</UIButton>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton size="lg">Large</UIButton>
      <UIButton size="sm">Small</UIButton>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton variant="primary" trailingIcon={<IconArrowForward />}>Continue</UIButton>
      <UIButton variant="secondary" leadingIcon={<IconAdd />}>Add new</UIButton>
      <UIButton variant="tertiary" size="sm" leadingIcon={<IconAdd />}>Add</UIButton>
    </div>
  ),
};

export const Floating: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton variant="primary" floating>Primary floating</UIButton>
      <UIButton variant="secondary" floating>Secondary floating</UIButton>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton variant="primary" disabled>Primary</UIButton>
      <UIButton variant="secondary" disabled>Secondary</UIButton>
      <UIButton variant="tertiary" disabled>Tertiary</UIButton>
    </div>
  ),
};

export const Loading: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIButton variant="primary" isLoading />
      <UIButton variant="secondary" isLoading />
      <UIButton variant="tertiary" isLoading />
    </div>
  ),
};
