import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@aec-craft/ui/components/primitives/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@aec-craft/ui/components/primitives/card";
import type { ReactNode } from "react";

/**
 * Error card + full-page shell, shared across apps' error.tsx / not-found.tsx /
 * global-error.tsx. Presentational only (no framework router): the action
 * (a Link or a reset Button) is passed in by the consuming route. Renderable
 * from both server and client trees — root error boundaries are client
 * components, not-found pages are server components.
 */

export interface ErrorCardProps {
  action?: ReactNode;
  /** Machine-readable code (e.g. an error digest, status, or OAuth error). Renders in `<code>`. */
  code?: string;
  description?: string;
  /** Friendly explanation of what the code means + what the user can do. */
  hint?: string;
  message?: string;
  title: string;
}

export function ErrorCard({
  title,
  description,
  code,
  message,
  hint,
  action,
}: ErrorCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description !== undefined && (
          <CardDescription>{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {(code !== undefined || message !== undefined) && (
          <Alert variant="destructive">
            {code !== undefined && (
              <AlertTitle>
                <code>{code}</code>
              </AlertTitle>
            )}
            {message !== undefined && (
              <AlertDescription>{message}</AlertDescription>
            )}
          </Alert>
        )}

        {hint !== undefined && (
          <div className="space-y-1">
            <h2 className="font-medium text-sm">What this means</h2>
            <p className="text-muted-foreground text-sm">{hint}</p>
          </div>
        )}

        {action !== undefined && <div>{action}</div>}
      </CardContent>
    </Card>
  );
}

/** Centered full-page frame around `ErrorCard` (used as the page body). */
export function ErrorPage(props: ErrorCardProps) {
  return (
    <main className="grid min-h-dvh place-items-center p-6">
      <div className="w-full max-w-md">
        <ErrorCard {...props} />
      </div>
    </main>
  );
}
