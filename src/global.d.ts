export {};

declare global {
  interface Window {
    electronAPI: {
      updateOverlay: (timeText: string) => void
      close: () => void
      minimize: () => void
    };
  }
}
