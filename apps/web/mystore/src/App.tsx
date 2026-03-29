import { UIButton, UITextButton, UIIconButton } from "@sg-foundation/ui-web";

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

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
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">With icons</p>
            <div className="flex items-center gap-4">
              <UIButton variant="primary" size="lg" leadingIcon={<ArrowIcon />}>Button label</UIButton>
              <UIButton variant="secondary" size="lg" trailingIcon={<ArrowIcon />}>Button label</UIButton>
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

        {/* Text Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Text Button</h2>
          <div className="flex items-center gap-6">
            <UITextButton size="lg" leadingIcon={<ArrowIcon />}>Button label</UITextButton>
            <UITextButton size="sm" leadingIcon={<ArrowIcon />}>Button label</UITextButton>
          </div>
          <div className="flex items-center gap-6">
            <UITextButton size="lg" disabled leadingIcon={<ArrowIcon />}>Button label</UITextButton>
          </div>
        </section>

        {/* Icon Button */}
        <section className="space-y-4">
          <h2 className="text-[18px] font-semibold text-[var(--color-text-icon-default)]">Icon Button</h2>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Primary / Secondary / Tertiary</p>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="lg" icon={<PlusIcon />} />
              <UIIconButton variant="secondary" size="lg" icon={<PlusIcon />} />
              <UIIconButton variant="tertiary" size="lg" icon={<PlusIcon />} />
            </div>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="md" icon={<PlusIcon />} />
              <UIIconButton variant="secondary" size="md" icon={<PlusIcon />} />
              <UIIconButton variant="tertiary" size="md" icon={<PlusIcon />} />
            </div>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="sm" icon={<PlusIcon />} />
              <UIIconButton variant="secondary" size="sm" icon={<PlusIcon />} />
              <UIIconButton variant="tertiary" size="sm" icon={<PlusIcon />} />
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-[12px] text-[var(--color-text-icon-subtle)]">Disabled</p>
            <div className="flex items-center gap-4">
              <UIIconButton variant="primary" size="lg" icon={<PlusIcon />} disabled />
              <UIIconButton variant="secondary" size="lg" icon={<PlusIcon />} disabled />
              <UIIconButton variant="tertiary" size="lg" icon={<PlusIcon />} disabled />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
