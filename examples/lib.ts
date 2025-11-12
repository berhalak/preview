import fs from 'fs';
export function read() {
  return fs.readFileSync('examples/node.ts', 'utf-8');
}