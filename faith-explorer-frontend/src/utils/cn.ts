/**
 * Utility for conditionally joining classNames
 * A simple alternative to clsx/classnames
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}

