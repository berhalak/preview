# 🔍 Preview CLI

A powerful CLI tool that instantly opens and previews `.html`, `.js`, and `.ts` files in an Electron window with automatic hot-reloading.

## ✨ Features

- 🚀 **Instant Preview** - Open any HTML, JavaScript, or TypeScript file in seconds
- 🔄 **Auto-Reload** - Automatically reloads when files change
- 📦 **TypeScript Support** - Automatic transpilation using esbuild
- 🎨 **DevTools Included** - Chrome DevTools open by default
- 🔥 **Hot Module Reloading** - Fast feedback loop for rapid development
- 🎯 **Simple CLI** - Just one command to preview any file
- ✨ **Reload Toast** - Visual feedback when files reload

## 📦 Installation

### Local Installation
```bash
npm install
```

### Global Installation (Recommended)
```bash
npm install -g .
```

After global installation, the `preview` command will be available system-wide.

## 🚀 Usage

### Basic Usage
```bash
preview <path-to-file>
```

### Examples
```bash
# Preview an HTML file
preview index.html

# Preview a JavaScript file
preview app.js

# Preview a TypeScript file (auto-transpiles)
preview demo.ts
```

## 🎯 How It Works

### HTML Files
- Loads directly using Electron's `loadFile()`
- Watches for changes and reloads automatically

### JavaScript Files
- Wraps in a minimal HTML template
- Loads the script and executes it
- Watches for changes and reloads

### TypeScript Files
- Transpiles to JavaScript using **esbuild**
- Outputs to `.preview-temp/` directory
- Watches source files and rebuilds on changes
- Auto-reloads after successful transpilation

## 📁 Project Structure

```
preview/
├── bin/
│   └── preview.js         # CLI entry point with shebang
├── src/
│   ├── main.js            # Electron main process
│   ├── previewServer.js   # File watcher & esbuild transpiler
│   └── renderer.html      # HTML wrapper template for JS/TS
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Technical Details

### Dependencies
- **electron** - Cross-platform desktop app framework
- **esbuild** - Fast TypeScript/JavaScript bundler
- **chokidar** - Efficient file watcher

### Window Configuration
- Default size: 800×600 pixels
- Resizable window
- DevTools open by default
- Node.js integration enabled (`nodeIntegration: true`)
- Context isolation disabled for direct Node.js access

### File Watching
The tool watches for changes in:
- The main file being previewed
- CSS files in the same directory
- Related TypeScript/JavaScript files

### Temporary Files
- Compiled TypeScript outputs are saved to `.preview-temp/`
- Automatically cleaned up when the app closes

## 🎨 Example Files

### Example TypeScript (`demo.ts`)
```typescript
document.body.innerHTML = `
  <div style="padding: 40px; text-align: center;">
    <h1>Hello from TypeScript! 🎉</h1>
    <p>Edit this file and watch it reload automatically.</p>
    <p>Current time: ${new Date().toLocaleTimeString()}</p>
  </div>
`;

setInterval(() => {
  const timeEl = document.querySelector('p:last-child');
  if (timeEl) {
    timeEl.textContent = `Current time: ${new Date().toLocaleTimeString()}`;
  }
}, 1000);
```

### Example JavaScript (`demo.js`)
```javascript
document.body.innerHTML = `
  <div style="padding: 40px; text-align: center;">
    <h1>Hello from JavaScript! 🚀</h1>
    <p>Changes auto-reload instantly.</p>
  </div>
`;
```

### Example HTML (`demo.html`)
```html
<!DOCTYPE html>
<html>
<head>
  <title>Preview Demo</title>
  <style>
    body { padding: 40px; font-family: sans-serif; }
  </style>
</head>
<body>
  <h1>Hello from HTML! 🌟</h1>
  <p>Edit and save to see changes instantly.</p>
</body>
</html>
```

## 🧪 Testing

```bash
# Test with a demo file
npm test

# Or manually test with your own files
preview examples/demo.html
preview examples/demo.js
preview examples/demo.ts
```

## 🎯 Development Workflow

1. Create your HTML/JS/TS file
2. Run `preview <filename>`
3. Edit the file in your favorite editor
4. Save - watch it reload automatically! ✨
5. See the "Reloaded ✨" toast notification

## 🔧 Troubleshooting

### Command not found
If `preview` command is not found after global installation:
```bash
npm link
```

### File not found
Make sure to provide the correct path to the file:
```bash
# Use absolute path
preview /full/path/to/file.ts

# Or relative path from current directory
preview ./src/app.ts
```

### TypeScript compilation errors
Check the terminal output for esbuild errors. The preview will not reload if compilation fails.

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests.

---

Built with ❤️ using Electron, esbuild, and chokidar
