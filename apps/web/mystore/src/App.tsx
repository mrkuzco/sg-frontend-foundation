import { UIButton } from "@sg-foundation/ui-web";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-surface-lighter)]">
      <div className="space-y-8 p-12">
        <h1 className="text-[var(--text-display-xs-bold)] font-bold text-[var(--color-text-icon-default)]">
          UIButton
        </h1>

        {/* Large */}
        <div className="space-y-3">
          <p className="text-[var(--text-label-sm)] text-[var(--color-text-icon-subtle)]">Large</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" size="lg">Button label</UIButton>
            <UIButton variant="secondary" size="lg">Button label</UIButton>
            <UIButton variant="tertiary" size="lg">Button label</UIButton>
          </div>
        </div>

        {/* Small */}
        <div className="space-y-3">
          <p className="text-[var(--text-label-sm)] text-[var(--color-text-icon-subtle)]">Small</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" size="sm">Button label</UIButton>
            <UIButton variant="secondary" size="sm">Button label</UIButton>
            <UIButton variant="tertiary" size="sm">Button label</UIButton>
          </div>
        </div>

        {/* Disabled */}
        <div className="space-y-3">
          <p className="text-[var(--text-label-sm)] text-[var(--color-text-icon-subtle)]">Disabled</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" disabled>Button label</UIButton>
            <UIButton variant="secondary" disabled>Button label</UIButton>
            <UIButton variant="tertiary" disabled>Button label</UIButton>
          </div>
        </div>

        {/* Loading */}
        <div className="space-y-3">
          <p className="text-[var(--text-label-sm)] text-[var(--color-text-icon-subtle)]">Loading</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" isLoading>Button label</UIButton>
            <UIButton variant="secondary" isLoading>Button label</UIButton>
            <UIButton variant="tertiary" isLoading>Button label</UIButton>
          </div>
        </div>
      </div>
    </div>
  );
}
