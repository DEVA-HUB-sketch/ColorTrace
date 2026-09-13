import { app, BrowserWindow, session } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;
const devServerUrls = ['http://127.0.0.1:4173', 'http://127.0.0.1:5173'];
const builtIndexPath = path.join(__dirname, '../dist/index.html');

async function loadApp(mainWindow: BrowserWindow) {
  if (isDev) {
    for (const devServerUrl of devServerUrls) {
      try {
        const response = await fetch(devServerUrl);
        if (response.ok) {
          await mainWindow.loadURL(devServerUrl);
          mainWindow.webContents.openDevTools({ mode: 'detach' });
          return;
        }
      } catch {
        // Keep trying the next candidate.
      }
    }
  }

  await mainWindow.loadFile(builtIndexPath);
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1500,
    height: 1000,
    minWidth: 1200,
    minHeight: 800,
    backgroundColor: '#F7F9FC',
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  loadApp(mainWindow);
}

app.whenReady().then(() => {
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    if (permission === 'media' || permission === 'geolocation') {
      callback(true);
      return;
    }
    callback(false);
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === 'media' || permission === 'geolocation';
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
