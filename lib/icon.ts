import type { ComponentType } from "react";

// Shared icon contract for components that take an icon as a prop (empty-state,
// sidebar-panel, scope-switcher, …). Structural on purpose: it accepts a
// Phosphor icon or any custom component that renders to an element styled via
// `className`, without coupling the prop to the Phosphor types.
export type IconComponent = ComponentType<{ className?: string }>;
