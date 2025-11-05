const { app, BrowserWindow, ipcMain, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { startWatcher } = require('./previewServer');

let mainWindow;
let watcher;
let tempDir;
let currentMenuTemplate = [];
const filePath = process.argv[2] || process.env.PREVIEW_FILE;
const cwd = process.env.PREVIEW_CWD || process.cwd();

if (!filePath) {
  console.error('No file path provided');
  app.quit();
}

const fileName = path.basename(filePath);
const fileExt = path.extname(filePath).toLowerCase();
const fileNameWithoutExt = path.basename(filePath, fileExt);
// Create unique temp directory for this instance
const sessionId = Date.now() + '-' + Math.random().toString(36).substr(2, 9);
tempDir = path.join(os.tmpdir(), 'preview-electron', sessionId);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    title: `${fileNameWithoutExt}`,
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
  } else if (fileExt === '.js' || fileExt === '.ts' || fileExt === '.jsx' || fileExt === '.tsx') {
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
  watcher = startWatcher(filePath, cwd, tempDir, reloadWindow);

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
  if (tempDir && fs.existsSync(tempDir)) {
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
    cwd,
    tempDir
  };
});

// IPC handler for setting custom menu
ipcMain.handle('set-menu', (event, menuTemplate) => {
  try {
    // Process the template and create click handlers
    const processedTemplate = processMenuTemplate(menuTemplate);
    const menu = Menu.buildFromTemplate(processedTemplate);
    if (mainWindow) {
      mainWindow.setMenu(menu);
      currentMenuTemplate = menuTemplate; // Store the template
    }
    return { success: true };
  } catch (error) {
    console.error('Error setting menu:', error);
    return { success: false, error: error.message };
  }
});

// Helper function to process menu template and setup IPC handlers
function processMenuTemplate(template) {
  return template.map(item => {
    const processed = { ...item };
    
    if (item.id) {
      // If item has an ID, create a click handler that sends IPC message
      processed.click = () => {
        if (mainWindow) {
          mainWindow.webContents.send(`menu-action-${item.id}`);
        }
      };
    }
    
    if (item.submenu) {
      processed.submenu = processMenuTemplate(item.submenu);
    }
    
    return processed;
  });
}

// IPC handler for adding menu items
ipcMain.handle('add-menu-item', (event, { label, submenu }) => {
  try {
    // Use stored template instead of getMenu()
    const template = [...currentMenuTemplate];
    template.push({ label, submenu });
    
    const processedTemplate = processMenuTemplate(template);
    const menu = Menu.buildFromTemplate(processedTemplate);
    if (mainWindow) {
      mainWindow.setMenu(menu);
      currentMenuTemplate = template; // Update stored template
    }
    return { success: true };
  } catch (error) {
    console.error('Error adding menu item:', error);
    return { success: false, error: error.message };
  }
});
