import type { Meta, StoryObj } from "@storybook/react-vite";
import { UIIconButton } from "./UIIconButton";
import { IconAdd, IconSettings, IconClose, IconSearch } from "@sg-foundation/icons";

const meta: Meta<typeof UIIconButton> = {
  title: "Components/UIIconButton",
  component: UIIconButton,
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
      options: ["lg", "md", "sm"],
    },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof UIIconButton>;

export const Default: Story = {
  args: {
    variant: "primary",
    size: "md",
    icon: <IconAdd />,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIIconButton variant="primary" icon={<IconAdd />} />
      <UIIconButton variant="secondary" icon={<IconSettings />} />
      <UIIconButton variant="tertiary" icon={<IconClose />} />
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIIconButton size="lg" icon={<IconAdd />} />
      <UIIconButton size="md" icon={<IconAdd />} />
      <UIIconButton size="sm" icon={<IconAdd />} />
    </div>
  ),
};

export const AllVariantsAllSizes: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <UIIconButton variant="primary" size="lg" icon={<IconAdd />} />
        <UIIconButton variant="primary" size="md" icon={<IconAdd />} />
        <UIIconButton variant="primary" size="sm" icon={<IconAdd />} />
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <UIIconButton variant="secondary" size="lg" icon={<IconSettings />} />
        <UIIconButton variant="secondary" size="md" icon={<IconSettings />} />
        <UIIconButton variant="secondary" size="sm" icon={<IconSettings />} />
      </div>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <UIIconButton variant="tertiary" size="lg" icon={<IconClose />} />
        <UIIconButton variant="tertiary" size="md" icon={<IconClose />} />
        <UIIconButton variant="tertiary" size="sm" icon={<IconClose />} />
      </div>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <UIIconButton variant="primary" icon={<IconAdd />} disabled />
      <UIIconButton variant="secondary" icon={<IconSearch />} disabled />
      <UIIconButton variant="tertiary" icon={<IconClose />} disabled />
    </div>
  ),
};
