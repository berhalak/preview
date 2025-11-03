const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { startWatcher } = require('./previewServer');

let mainWindow;
let watcher;
const filePath = process.argv[2] || process.env.PREVIEW_FILE;
const cwd = process.env.PREVIEW_CWD || process.cwd();

if (!filePath) {
  console.error('No file path provided');
  app.quit();
}

const fileName = path.basename(filePath);
const fileExt = path.extname(filePath).toLowerCase();

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: `Preview – ${fileName}`,
    webPreferences: {
      nodeIntegration: true, // 👈 pełny dostęp do Node.js
      contextIsolation: false,
    },
  });

  // Load the appropriate file
  loadFile();

  mainWindow.on('closed', () => {
    mainWindow = null;
    if (watcher) {
      watcher.close();
    }
  });
}

function loadFile() {
  if (fileExt === '.html') {
    // Load HTML directly
    mainWindow.loadFile(filePath);
  } else if (fileExt === '.js' || fileExt === '.ts') {
    // Load wrapper HTML with the script
    const wrapperPath = path.join(__dirname, 'renderer.html');
    mainWindow.loadFile(wrapperPath);
  } else {
    console.error(`Unsupported file type: ${fileExt}`);
    app.quit();
  }
}

function reloadWindow() {
  if (mainWindow) {
    mainWindow.reload();
  }
}

app.whenReady().then(() => {
  createWindow();

  // Start file watcher
  watcher = startWatcher(filePath, cwd, reloadWindow);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (watcher) {
    watcher.close();
  }
  // Clean up temp files
  const tempDir = path.join(cwd, '.preview-temp');
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
  app.quit();
});

// IPC handler for getting file info
ipcMain.handle('get-file-info', () => {
  return {
    filePath,
    fileName,
    fileExt,
    cwd
  };
});
