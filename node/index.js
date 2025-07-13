const { app, BrowserWindow, powerSaveBlocker, ipcMain, nativeImage } = require('electron');
const path = require('path');
const { createOverlayIcon } = require('./overlayIcon');

let mainWindow;
let powerSaveId;

process.on('uncaughtException', (err) => {
  console.error(err);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(reason);
  process.exit(1);
});

ipcMain.on('close-window', () => {
  if (mainWindow) {
    mainWindow.close();
  }
});

ipcMain.on('update-timer-overlay', (event, timeText) => {
  if (!mainWindow) {
    return;
  }

  if (!timeText) {
    mainWindow.setIcon(path.join(__dirname, 'icon.ico'));

    return;
  }

  try {
    const buffer = createOverlayIcon(timeText);
    const icon = nativeImage.createFromBuffer(buffer);

    mainWindow.setIcon(icon);
  } catch (e) {
    mainWindow.setIcon(path.join(__dirname, 'icon.ico'));
  }
});

ipcMain.on('renderer-error', (event, errorData) => {
  console.error(errorData);
  process.exit(1);
});

ipcMain.on('minimize-window', () => {
  if (mainWindow) {
    mainWindow.minimize();
  }
});

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 170,
    height: 90,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      backgroundThrottling: false,
    },
    title: 'Random Timer',
    resizable: false,
    maximizable: false,
    fullscreenable: false,
    autoHideMenuBar: true,
    frame: false,
    transparent: true,
    icon: path.join(__dirname, 'icon.ico'),
  });

  const isDev = process.argv.includes('--dev');
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist-react', 'index.html'));
  }

  powerSaveId = powerSaveBlocker.start('prevent-app-suspension');

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (powerSaveBlocker.isStarted(powerSaveId)) {
      powerSaveBlocker.stop(powerSaveId);
    }
  });

  mainWindow.on('unresponsive', () => {
    console.error('Main window is unresponsive');
    process.exit(1);
  });
};

app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');
app.disableHardwareAcceleration();
app.setName('Random Timer');

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('before-quit', () => {
  if (powerSaveBlocker.isStarted(powerSaveId)) {
    powerSaveBlocker.stop(powerSaveId);
  }
});

app.on('render-process-gone', (event, webContents, details) => {
  console.error('Render process gone:', details);
  process.exit(1);
});

app.on('child-process-gone', (event, details) => {
  console.error('Child process gone:', details);
  process.exit(1);
});

app.whenReady().then(createWindow);
