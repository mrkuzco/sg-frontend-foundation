import { UIButton } from "@sg-foundation/ui";

export default function App() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="space-y-8 p-12">
        <h1 className="text-2xl font-bold text-primary-900">UIButton — MyStore</h1>

        {/* Large buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Large</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" size="lg">Button label</UIButton>
            <UIButton variant="secondary" size="lg">Button label</UIButton>
            <UIButton variant="tertiary" size="lg">Button label</UIButton>
          </div>
        </div>

        {/* Small buttons */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Small</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" size="sm">Button label</UIButton>
            <UIButton variant="secondary" size="sm">Button label</UIButton>
            <UIButton variant="tertiary" size="sm">Button label</UIButton>
          </div>
        </div>

        {/* Disabled */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Disabled</p>
          <div className="flex items-center gap-4">
            <UIButton variant="primary" disabled>Button label</UIButton>
            <UIButton variant="secondary" disabled>Button label</UIButton>
            <UIButton variant="tertiary" disabled>Button label</UIButton>
          </div>
        </div>

        {/* Loading */}
        <div className="space-y-3">
          <p className="text-sm font-medium text-text-secondary">Loading</p>
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
