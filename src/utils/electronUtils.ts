export const setOverlayIcon = (timeText: string): void => {
  window.electronAPI?.setOverlayIcon?.(timeText);
};

export const closeWindow = (): void => {
  window.electronAPI?.close?.();
};

export const minimizeWindow = (): void => {
  window.electronAPI?.minimize?.();
};
