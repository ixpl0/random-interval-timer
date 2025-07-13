const {
  app,
  BrowserWindow,
  powerSaveBlocker,
  ipcMain,
  nativeImage,
} = require('electron');
const path = require('path');
const { createOverlayIcon } = require('./overlayIcon');

let mainWindow;
let powerSaveId;

const ICON_PATH = app.isPackaged
  ? path.join(path.dirname(process.execPath), 'resources', 'app', 'node', 'icon.ico')
  : path.join(__dirname, 'icon.ico');

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
    mainWindow.setIcon(ICON_PATH);
    return;
  }

  try {
    const buffer = createOverlayIcon(timeText);
    const icon = nativeImage.createFromBuffer(buffer);

    if (!icon.isEmpty()) {
      mainWindow.setIcon(icon);
    } else {
      console.warn('Created icon is empty, falling back to default');
      mainWindow.setIcon(ICON_PATH);
    }
  } catch (error) {
    console.error('Error creating overlay icon:', error);
    mainWindow.setIcon(ICON_PATH);
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
  const windowOptions = {
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
  };

  windowOptions.icon = ICON_PATH;
  mainWindow = new BrowserWindow(windowOptions);

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

app.whenReady()
  .then(() => {
    app.setAppUserModelId('ixpl0.random-interval-timer');
    createWindow();
  });
