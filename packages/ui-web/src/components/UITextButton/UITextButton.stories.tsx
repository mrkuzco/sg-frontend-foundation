import type { Meta, StoryObj } from "@storybook/react-vite";
import { UITextButton } from "./UITextButton";
import { IconArrowForward, IconChevronBack } from "@sg-foundation/icons";

const meta: Meta<typeof UITextButton> = {
  title: "Buttons/UITextButton",
  component: UITextButton,
  parameters: {
    layout: "centered",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["lg", "sm"],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
    leadingIcon: { table: { disable: true } },
    trailingIcon: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof UITextButton>;

export const Default: Story = {
  args: {
    size: "lg",
    children: "Button label",
    leadingIcon: <IconArrowForward />,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <UITextButton size="lg" leadingIcon={<IconArrowForward />}>Large</UITextButton>
      <UITextButton size="sm" leadingIcon={<IconArrowForward />}>Small</UITextButton>
    </div>
  ),
};

export const WithTrailingIcon: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <UITextButton size="lg" trailingIcon={<IconChevronBack />}>Go back</UITextButton>
      <UITextButton size="sm" trailingIcon={<IconChevronBack />}>Go back</UITextButton>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <UITextButton size="lg" disabled leadingIcon={<IconArrowForward />}>Disabled</UITextButton>
      <UITextButton size="sm" disabled leadingIcon={<IconArrowForward />}>Disabled</UITextButton>
    </div>
  ),
};
