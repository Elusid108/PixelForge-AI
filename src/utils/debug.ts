/**
 * Debug flags and helpers for history/list stabilization.
 * All logging is dev-only and gated; no production impact when disabled.
 */

export const DEBUG_HISTORY = import.meta.env.DEV && false;

export function debugHistory(...args: unknown[]): void {
  if (DEBUG_HISTORY) {
    console.log('[history]', ...args);
  }
}
