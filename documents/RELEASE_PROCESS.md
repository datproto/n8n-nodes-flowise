# Release Process for n8n-nodes-flowise

This document outlines the complete process for releasing the n8n-nodes-flowise package to npm.

## Prerequisites

1. **npm Account**: Ensure you have an npm account with publishing permissions
2. **GitHub Repository**: Repository should be public and properly configured
3. **NPM_TOKEN Secret**: GitHub repository secret configured for automated publishing

## Setting Up npm Authentication

### 1. Create NPM Access Token

1. Log in to [npmjs.com](https://www.npmjs.com)
2. Go to Access Tokens in your account settings
3. Generate a new token with "Automation" type
4. Copy the token (it starts with `npm_`)

### 2. Add GitHub Secret

1. Go to your GitHub repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Click "New repository secret"
4. Name: `NPM_TOKEN`
5. Value: Your npm token from step 1

## Release Process

### Automated Release (Recommended)

1. **Prepare Release**:
   ```bash
   # Ensure all changes are committed
   git add .
   git commit -m "feat: prepare for release v0.1.0"
   git push origin main
   ```

2. **Create GitHub Release**:
   - Go to GitHub repository → Releases
   - Click "Create a new release"
   - Tag version: `v0.1.0` (must start with 'v')
   - Release title: `Release v0.1.0`
   - Description: List of changes and features
   - Click "Publish release"

3. **Automated Workflow**:
   - GitHub Actions will automatically:
     - Run tests and linting
     - Build the package
     - Publish to npm with provenance

### Manual Release (Fallback)

1. **Build and Test**:
   ```bash
   pnpm install
   pnpm lint
   pnpm build
   node test-flowise.js
   ```

2. **Login to npm**:
   ```bash
   npm login
   ```

3. **Publish**:
   ```bash
   pnpm publish --access public
   ```

## Version Management

Follow [Semantic Versioning](https://semver.org/):

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backward compatible
- **PATCH** (0.0.1): Bug fixes, backward compatible

### Update Version

```bash
# Update package.json version
npm version patch   # 0.1.0 → 0.1.1
npm version minor   # 0.1.0 → 0.2.0  
npm version major   # 0.1.0 → 1.0.0
```

## Quality Checks

Before releasing, ensure:

- [ ] All tests pass: `node test-flowise.js`
- [ ] No linting errors: `pnpm lint`
- [ ] Clean build: `pnpm build`
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version bumped in package.json

## Post-Release

1. **Verify Publication**:
   - Check package on [npmjs.com](https://www.npmjs.com/package/n8n-nodes-flowise)
   - Test installation: `npm install n8n-nodes-flowise`

2. **Update Documentation**:
   - Update README with new version
   - Add release notes to CHANGELOG.md

3. **Announce Release**:
   - Post in n8n community
   - Update project documentation

## Troubleshooting

### Common Issues

1. **NPM_TOKEN not working**:
   - Verify token has "Automation" type
   - Check token hasn't expired
   - Ensure correct secret name in GitHub

2. **Build failures**:
   - Check TypeScript compilation
   - Verify all dependencies installed
   - Review error logs in Actions

3. **Publishing errors**:
   - Ensure package name is available
   - Check version not already published
   - Verify npm registry configuration

### Emergency Procedures

1. **Unpublish (within 24 hours)**:
   ```bash
   npm unpublish n8n-nodes-flowise@0.1.0
   ```

2. **Deprecate version**:
   ```bash
   npm deprecate n8n-nodes-flowise@0.1.0 "This version has critical issues"
   ```

## Monitoring

- **npm downloads**: Monitor package adoption
- **GitHub issues**: Track user feedback
- **n8n compatibility**: Test with new n8n versions

## Security

- Keep npm tokens secure
- Regular dependency updates
- Monitor for vulnerabilities
- Use npm audit before publishing

## Contact

For release questions or issues:
- GitHub Issues: [n8n-nodes-flowise/issues](https://github.com/datproto/n8n-nodes-flowise/issues)
- Email: contact@dataproto.com
