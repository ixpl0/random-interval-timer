const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setOverlayIcon: (timeText) => ipcRenderer.send('update-timer-overlay', timeText),
  close: () => ipcRenderer.send('close-window'),
  minimize: () => ipcRenderer.send('minimize-window'),
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
});
