"use client";

// Single re-export of the Phosphor icon set so apps and design-system code
// import icons from here, not the vendor directly — one version to manage:
//   import { PlusIcon } from "@aec-craft/ui/icons";
//
// `"use client"` because Phosphor initializes a React context at module load,
// which is illegal in a Server Component. Marking the barrel client lets RSCs
// import icons too — Next renders them across a client boundary.
export * from "@phosphor-icons/react";
