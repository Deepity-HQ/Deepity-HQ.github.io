import { useSyncExternalStore } from "react";

let isOpen = false;
const listeners = new Set<() => void>();

const set = (v: boolean) => {
  isOpen = v;
  listeners.forEach((l) => l());
};

export const openDocsChooser = () => set(true);
export const closeDocsChooser = () => set(false);

export function useDocsChooserOpen() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => isOpen,
    () => false,
  );
}
