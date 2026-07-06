/**
 * Merge class names
 * @param  {...(string | undefined | false | null)} classes
 */
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
