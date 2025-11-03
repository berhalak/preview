const chokidar = require('chokidar');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

let buildContext = null;

async function transpileTypeScript(filePath, cwd) {
  const tempDir = path.join(cwd, '.preview-temp');
  const fileName = path.basename(filePath, '.ts');
  const outFile = path.join(tempDir, `${fileName}.js`);

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    await esbuild.build({
      entryPoints: [filePath],
      bundle: true,
      outfile: outFile,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      sourcemap: 'inline',
    });

    console.log(`✓ Transpiled: ${path.basename(filePath)} → ${path.relative(cwd, outFile)}`);
    return outFile;
  } catch (error) {
    console.error('Transpilation error:', error);
    throw error;
  }
}

function startWatcher(filePath, cwd, onReload) {
  const fileDir = path.dirname(filePath);
  const fileExt = path.extname(filePath).toLowerCase();

  // Files to watch
  const watchPatterns = [
    filePath, // The main file
    path.join(fileDir, '*.css'), // CSS files in the same directory
    path.join(fileDir, '*.html'), // HTML files
  ];

  // If it's a TypeScript file, also watch imported files
  if (fileExt === '.ts') {
    watchPatterns.push(path.join(fileDir, '*.ts'));
  } else if (fileExt === '.js') {
    watchPatterns.push(path.join(fileDir, '*.js'));
  }

  console.log(`👀 Watching for changes...`);

  const watcher = chokidar.watch(watchPatterns, {
    ignored: /(^|[\/\\])\../, // ignore dotfiles
    persistent: true,
    ignoreInitial: true,
  });

  // Handle file changes
  watcher.on('change', async (changedPath) => {
    console.log(`\n📝 File changed: ${path.relative(cwd, changedPath)}`);

    const ext = path.extname(changedPath).toLowerCase();

    // If TypeScript file changed, rebuild it
    if (ext === '.ts') {
      try {
        await transpileTypeScript(filePath, cwd);
        console.log('🔄 Reloading...');
        onReload();
      } catch (error) {
        console.error('Build failed, not reloading');
      }
    } else {
      // For HTML, JS, CSS changes, just reload
      console.log('🔄 Reloading...');
      onReload();
    }
  });

  watcher.on('error', (error) => {
    console.error('Watcher error:', error);
  });

  // Initial build for TypeScript files
  if (fileExt === '.ts') {
    transpileTypeScript(filePath, cwd).catch(console.error);
  }

  return watcher;
}

module.exports = { startWatcher, transpileTypeScript };
