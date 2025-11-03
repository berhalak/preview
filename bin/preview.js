#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse command-line arguments
const args = process.argv.slice(2);

if (args.length === 0) {
  console.error('Usage: preview <path-to-file>');
  console.error('Example: preview index.html');
  console.error('         preview index.js');
  console.error('         preview index.ts');
  process.exit(1);
}

const filePath = args[0];
const absoluteFilePath = path.resolve(process.cwd(), filePath);

// Check if file exists
if (!fs.existsSync(absoluteFilePath)) {
  console.error(`Error: File not found: ${filePath}`);
  process.exit(1);
}

// Get the electron path
const electronPath = require('electron');
const mainPath = path.join(__dirname, '..', 'src', 'main.js');

// Launch Electron with the file path as an argument
const electronProcess = spawn(electronPath, [mainPath, absoluteFilePath], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PREVIEW_FILE: absoluteFilePath,
    PREVIEW_CWD: process.cwd()
  }
});

electronProcess.on('close', (code) => {
  process.exit(code);
});
