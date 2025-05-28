# Publishing Guide

This document explains how to publish new versions of the n8n-nodes-flowise package to npmjs.

## Prerequisites

Before publishing, ensure you have:

1. **npm Account**: Create an account at [npmjs.com](https://www.npmjs.com/)
2. **npm CLI**: Installed with Node.js
3. **Git**: Configured with your name and email
4. **Repository Access**: Push access to the GitHub repository

## Setup

Run the setup checker to verify your environment:

```bash
npm run setup-publish
```

This will check:
- ✅ npm authentication status
- ✅ Git configuration
- ✅ Git remote configuration

### First-time Setup

If the setup checker shows issues, follow these steps:

#### 1. Login to npm
```bash
npm login
```
Enter your npmjs credentials when prompted.

#### 2. Configure Git (if needed)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

## Publishing Process

The project includes automated scripts for publishing:

### Quick Commands

```bash
# Patch version (bug fixes): 0.1.1 → 0.1.2
npm run publish:patch

# Minor version (new features): 0.1.1 → 0.2.0
npm run publish:minor

# Major version (breaking changes): 0.1.1 → 1.0.0
npm run publish:major

# Pre-release version: 0.1.1 → 0.1.2-0
npm run publish:prerelease
```

### Manual Publishing

You can also use the publish script directly:

```bash
# Default (patch)
node publish.js

# Specific version type
node publish.js minor
node publish.js major
node publish.js prerelease

# Show help
node publish.js --help
```

## What the Publish Script Does

The automated publish script performs these steps:

1. **✅ Validation**
   - Checks git status (no uncommitted changes)
   - Validates package.json configuration
   - Verifies n8n node setup

2. **🔨 Build**
   - Cleans previous build
   - Compiles TypeScript
   - Builds icons

3. **🧪 Testing**
   - Runs the main test suite
   - Validates node loading compatibility

4. **📈 Version Management**
   - Updates version in package.json
   - Creates git commit for version bump
   - Creates git tag (e.g., v0.1.2)

5. **📤 Git Operations**
   - Pushes commits to GitHub
   - Pushes tags to GitHub

6. **🚀 npm Publishing**
   - Publishes package to npmjs
   - Sets public access

## Version Types

Choose the appropriate version type based on the changes:

| Type | When to Use | Example |
|------|-------------|---------|
| `patch` | Bug fixes, documentation updates | 0.1.1 → 0.1.2 |
| `minor` | New features, backward compatible | 0.1.1 → 0.2.0 |
| `major` | Breaking changes | 0.1.1 → 1.0.0 |
| `prerelease` | Beta/alpha releases | 0.1.1 → 0.1.2-0 |

## Pre-publish Checklist

Before publishing, ensure:

- [ ] All tests pass: `npm test`
- [ ] Code is properly formatted: `npm run format`
- [ ] No lint errors: `npm run lint`
- [ ] Documentation is updated
- [ ] CHANGELOG.md is updated
- [ ] All changes are committed
- [ ] You're on the main branch

## Troubleshooting

### Common Issues

#### "Not logged in to npm"
```bash
npm login
```

#### "Uncommitted changes detected"
```bash
git add .
git commit -m "Your commit message"
```

#### "No git remote configured"
```bash
git remote add origin https://github.com/datproto/n8n-nodes-flowise.git
```

#### "Permission denied"
- Ensure you have publishing rights to the package
- Check your npm user has access to the package

### Manual Recovery

If the automated script fails partway through:

1. **Version was updated but not published:**
   ```bash
   npm publish --access public
   ```

2. **Git tag created but not pushed:**
   ```bash
   git push origin --tags
   ```

3. **Reset version if needed:**
   ```bash
   git reset --hard HEAD~1  # Remove version commit
   git tag -d v0.1.2        # Remove local tag
   ```

## Post-publish Steps

After successful publication:

1. **Create GitHub Release**
   - Go to GitHub → Releases → Create new release
   - Select the new tag
   - Add release notes

2. **Update Documentation**
   - Update installation instructions
   - Add new features to README

3. **Announce**
   - Update n8n community
   - Social media announcements
   - Documentation sites

## Package Information

- **Package Name**: `n8n-nodes-flowise`
- **npm Registry**: https://www.npmjs.com/package/n8n-nodes-flowise
- **Repository**: https://github.com/datproto/n8n-nodes-flowise

## Support

If you encounter issues with publishing:

1. Check the troubleshooting section above
2. Review npm documentation
3. Contact the maintainers via GitHub issues
