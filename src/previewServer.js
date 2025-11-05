const chokidar = require('chokidar');
const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');
const os = require('os');

let buildContext = null;

async function transpileTypeScript(filePath, tempDir) {
  const ext = path.extname(filePath);
  const fileName = path.basename(filePath, ext);
  const outFile = path.join(tempDir, `${fileName}.js`);

  // Create temp directory if it doesn't exist
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  try {
    const buildOptions = {
      entryPoints: [filePath],
      bundle: true,
      outfile: outFile,
      format: 'iife',
      platform: 'browser',
      target: 'es2020',
      sourcemap: 'inline',
    };

    // Add JSX configuration for .jsx and .tsx files
    if (ext === '.jsx' || ext === '.tsx') {
      buildOptions.jsx = 'transform';
      buildOptions.jsxFactory = 'React.createElement';
      buildOptions.jsxFragment = 'React.Fragment';
    }

    await esbuild.build(buildOptions);

    console.log(`✓ Transpiled: ${path.basename(filePath)} → ${outFile}`);
    return outFile;
  } catch (error) {
    console.error('Transpilation error:', error);
    throw error;
  }
}

function startWatcher(filePath, cwd, tempDir, onReload) {
  const fileDir = path.dirname(filePath);
  const fileExt = path.extname(filePath).toLowerCase();

  // Files to watch
  const watchPatterns = [
    filePath, // The main file
    path.join(fileDir, '*.css'), // CSS files in the same directory
    path.join(fileDir, '*.html'), // HTML files
  ];

  // Watch related files based on extension
  if (fileExt === '.ts' || fileExt === '.tsx') {
    watchPatterns.push(path.join(fileDir, '*.ts'));
    watchPatterns.push(path.join(fileDir, '*.tsx'));
  } else if (fileExt === '.js' || fileExt === '.jsx') {
    watchPatterns.push(path.join(fileDir, '*.js'));
    watchPatterns.push(path.join(fileDir, '*.jsx'));
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

    // If TypeScript/JSX file changed, rebuild it
    if (ext === '.ts' || ext === '.tsx' || ext === '.jsx') {
      try {
        await transpileTypeScript(filePath, tempDir);
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

  // Initial build for TypeScript/JSX files
  if (fileExt === '.ts' || fileExt === '.tsx' || fileExt === '.jsx') {
    transpileTypeScript(filePath, tempDir).catch(console.error);
  }

  return watcher;
}

module.exports = { startWatcher, transpileTypeScript };
