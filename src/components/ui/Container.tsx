import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/cn";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/**
 * Largura máxima de 1200px, centralizado, com 20px de respiro lateral
 * no mobile e 32px a partir de md.
 */
export default function Container<T extends ElementType = "div">({
  as,
  className,
  ...props
}: ContainerProps<T>) {
  const Component: ElementType = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full max-w-site px-gutter md:px-gutter-lg",
        className,
      )}
      {...props}
    />
  );
}
