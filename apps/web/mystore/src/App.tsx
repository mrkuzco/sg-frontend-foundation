import { UIButton, UITextButton, UIIconButton } from "@sg-foundation/ui-web";
import {
  IconAdd,
  IconArrowForward,
  IconSearch,
  IconSettings,
  IconClose,
  IconDelete,
  IconFilter,
  IconKebab,
} from "@sg-foundation/icons";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lighter)]">
      <div className="space-y-10 p-12 max-w-3xl">
        <h1 className="text-[28px] font-bold text-[var(--color-text-icon-default)]">
          CTA Components
        </h1>

        {/* Pill Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Pill Button</h2>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Large</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="lg">Button label</UIButton>
              <UIButton variant="secondary" size="lg">Button label</UIButton>
              <UIButton variant="tertiary" size="lg">Button label</UIButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Small</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="sm">Button label</UIButton>
              <UIButton variant="secondary" size="sm">Button label</UIButton>
              <UIButton variant="tertiary" size="sm">Button label</UIButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">With Icons</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="lg" trailingIcon={<IconArrowForward />}>Button label</UIButton>
              <UIButton variant="secondary" size="lg" trailingIcon={<IconSearch />}>Search</UIButton>
              <UIButton variant="tertiary" size="sm" leadingIcon={<IconAdd />}>Add new</UIButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Disabled</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" disabled>Button label</UIButton>
              <UIButton variant="secondary" disabled>Button label</UIButton>
              <UIButton variant="tertiary" disabled>Button label</UIButton>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Loading</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" isLoading />
              <UIButton variant="secondary" isLoading />
              <UIButton variant="tertiary" isLoading />
            </div>
          </div>
        </section>

        {/* Floating Pill Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Floating Pill Button</h2>
          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Large</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="lg" floating>Button label</UIButton>
              <UIButton variant="secondary" size="lg" floating>Button label</UIButton>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Small</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="sm" floating>Button label</UIButton>
              <UIButton variant="secondary" size="sm" floating>Button label</UIButton>
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Disabled</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="lg" floating disabled>Button label</UIButton>
              <UIButton variant="secondary" size="lg" floating disabled>Button label</UIButton>
            </div>
          </div>
        </section>

        {/* Text Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Text Button</h2>
          <div className="flex items-center gap-6">
            <UITextButton size="lg" leadingIcon={<IconArrowForward />}>Button label</UITextButton>
            <UITextButton size="sm" leadingIcon={<IconArrowForward />}>Button label</UITextButton>
          </div>
          <div className="flex items-center gap-6">
            <UITextButton size="lg" disabled leadingIcon={<IconArrowForward />}>Disabled</UITextButton>
          </div>
        </section>

        {/* Icon Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Icon Button</h2>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Large / Medium / Small</p>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="lg" icon={<IconAdd />} />
              <UIIconButton variant="secondary" size="lg" icon={<IconSettings />} />
              <UIIconButton variant="tertiary" size="lg" icon={<IconClose />} />
            </div>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="md" icon={<IconDelete />} />
              <UIIconButton variant="secondary" size="md" icon={<IconFilter />} />
              <UIIconButton variant="tertiary" size="md" icon={<IconKebab />} />
            </div>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="sm" icon={<IconAdd />} />
              <UIIconButton variant="secondary" size="sm" icon={<IconSearch />} />
              <UIIconButton variant="tertiary" size="sm" icon={<IconClose />} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Disabled</p>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="lg" icon={<IconAdd />} disabled />
              <UIIconButton variant="secondary" size="lg" icon={<IconSettings />} disabled />
              <UIIconButton variant="tertiary" size="lg" icon={<IconClose />} disabled />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
