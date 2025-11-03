# Publishing Guide for @berhalak/preview

## Prerequisites

1. Make sure you're logged in to npm:
   ```bash
   npm login
   ```

2. Verify your login:
   ```bash
   npm whoami
   ```

## Pre-publish Checklist

- [ ] Update version in `package.json` (follow [semantic versioning](https://semver.org/))
- [ ] Update `README.md` if needed
- [ ] Test the CLI locally:
  ```bash
  npm test
  node bin/preview.js examples/demo.ts
  ```
- [ ] Check which files will be published:
  ```bash
  npm pack --dry-run
  ```

## Publishing Steps

### 1. Check package contents
```bash
npm pack --dry-run
```

This shows what files will be included in the package.

### 2. Test installation locally
```bash
npm pack
npm install -g berhalak-preview-1.0.0.tgz
preview examples/demo.html
npm uninstall -g @berhalak/preview
rm berhalak-preview-1.0.0.tgz
```

### 3. Publish to npm
```bash
npm publish
```

For scoped packages (like `@berhalak/preview`), the package is public by default due to `publishConfig.access: "public"` in package.json.

### 4. Verify publication
```bash
npm view @berhalak/preview
```

## Installing the Published Package

Users can install it globally:
```bash
npm install -g @berhalak/preview
```

Then use it:
```bash
preview index.html
preview app.js
preview main.ts
```

## Updating the Package

1. Make your changes
2. Update the version:
   ```bash
   npm version patch  # for bug fixes (1.0.0 -> 1.0.1)
   npm version minor  # for new features (1.0.0 -> 1.1.0)
   npm version major  # for breaking changes (1.0.0 -> 2.0.0)
   ```
3. Push the changes and tags:
   ```bash
   git push
   git push --tags
   ```
4. Publish:
   ```bash
   npm publish
   ```

## Unpublishing (if needed)

⚠️ **Warning**: Unpublishing is permanent and should be avoided!

```bash
npm unpublish @berhalak/preview@1.0.0  # unpublish specific version
npm unpublish @berhalak/preview --force  # unpublish entire package
```

## Version History

- **1.0.0** - Initial release
  - HTML, JS, TS file preview
  - Auto-reload functionality
  - TypeScript transpilation with esbuild
  - File watching with chokidar
