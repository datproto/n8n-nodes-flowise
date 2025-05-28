#!/usr/bin/env node

/**
 * Automated npm publish script for n8n-nodes-flowise
 * 
 * This script automates the entire publishing process:
 * 1. Validates the current state
 * 2. Builds the project
 * 3. Runs tests
 * 4. Updates version (patch/minor/major)
 * 5. Creates git tag
 * 6. Pushes to GitHub
 * 7. Publishes to npmjs
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    });
    return result?.toString().trim();
  } catch (error) {
    throw new Error(`Command failed: ${command}\n${error.message}`);
  }
}

function checkGitStatus() {
  log('🔍 Checking git status...', 'blue');

  // Check if we're in a git repository
  try {
    exec('git rev-parse --git-dir', { silent: true });
  } catch (error) {
    throw new Error('Not in a git repository');
  }

  // Check for uncommitted changes
  const status = exec('git status --porcelain', { silent: true });
  if (status) {
    log('⚠️  Warning: Uncommitted changes detected:', 'yellow');
    console.log(status);
    throw new Error('Please commit all changes before publishing. Use --force to override (not recommended)');
  }

  log('✅ Git status clean', 'green');
}

function validatePackage() {
  log('📦 Validating package.json...', 'blue');

  const packagePath = path.join(__dirname, 'package.json');
  if (!fs.existsSync(packagePath)) {
    throw new Error('package.json not found');
  }

  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

  // Validate required fields
  const requiredFields = ['name', 'version', 'description', 'keywords'];
  for (const field of requiredFields) {
    if (!pkg[field]) {
      throw new Error(`Missing required field in package.json: ${field}`);
    }
  }

  // Validate n8n configuration
  if (!pkg.n8n) {
    throw new Error('Missing n8n configuration in package.json');
  }

  if (!pkg.n8n.credentials || !pkg.n8n.nodes) {
    throw new Error('Missing n8n credentials or nodes configuration');
  }

  log('✅ Package.json validation passed', 'green');
  return pkg;
}

function buildProject() {
  log('🔨 Building project...', 'blue');
  exec('pnpm build');
  log('✅ Build completed', 'green');
}

function runTests() {
  log('🧪 Running tests...', 'blue');

  // Run the main test suite
  exec('node test-flowise.js');

  // Run node loading test
  exec('node test-node-loading.js');

  log('✅ All tests passed', 'green');
}

function updateVersion(versionType) {
  log(`📈 Updating version (${versionType})...`, 'blue');

  const newVersion = exec(`npm version ${versionType} --no-git-tag-version`, { silent: true });
  const version = newVersion.replace('v', '');

  log(`✅ Version updated to ${version}`, 'green');
  return version;
}

function createGitTag(version) {
  log(`🏷️  Creating git tag v${version}...`, 'blue');

  // Stage package.json changes
  exec('git add package.json');

  // Commit version bump
  exec(`git commit -m "chore: bump version to ${version}"`);

  // Create tag
  exec(`git tag -a v${version} -m "Release v${version}"`);

  log(`✅ Git tag v${version} created`, 'green');
}

function pushToGitHub() {
  log('📤 Pushing to GitHub...', 'blue');

  // Push commits
  exec('git push origin main');

  // Push tags
  exec('git push origin --tags');

  log('✅ Pushed to GitHub', 'green');
}

function publishToNpm(version) {
  log('🚀 Publishing to npmjs...', 'blue');

  // Check if logged in to npm
  try {
    const npmUser = exec('npm whoami', { silent: true });
    log(`📝 Publishing as: ${npmUser}`, 'cyan');
  } catch (error) {
    throw new Error('Not logged in to npm. Run: npm login');
  }

  // Publish package
  exec('npm publish --access public');

  log(`✅ Published v${version} to npmjs`, 'green');
  log(`📦 Package URL: https://www.npmjs.com/package/n8n-nodes-flowise`, 'cyan');
}

function showSuccessMessage(version) {
  log('\n🎉 Publication completed successfully!', 'green');
  log('═══════════════════════════════════════', 'green');
  log(`📦 Version: ${version}`, 'bright');
  log('🌐 npmjs: https://www.npmjs.com/package/n8n-nodes-flowise', 'cyan');
  log('📖 GitHub: https://github.com/datproto/n8n-nodes-flowise', 'cyan');
  log('\n📋 Installation for users:', 'bright');
  log('npm install n8n-nodes-flowise', 'cyan');
  log('\n📝 Next steps:', 'bright');
  log('1. Update CHANGELOG.md with release notes', 'yellow');
  log('2. Create GitHub release from the new tag', 'yellow');
  log('3. Update documentation if needed', 'yellow');
  log('4. Announce the release', 'yellow');
}

async function main() {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let versionType = 'patch'; // default

    if (args.length > 0) {
      const validTypes = ['patch', 'minor', 'major', 'prerelease'];
      if (validTypes.includes(args[0])) {
        versionType = args[0];
      } else {
        throw new Error(`Invalid version type. Use: ${validTypes.join(', ')}`);
      }
    }

    log('🚀 Starting automated npm publish process...', 'bright');
    log(`📈 Version type: ${versionType}`, 'cyan');
    log('════════════════════════════════════════════', 'bright');

    // Pre-publish checks
    checkGitStatus();
    const pkg = validatePackage();

    // Build and test
    buildProject();
    runTests();

    // Version management
    const newVersion = updateVersion(versionType);
    createGitTag(newVersion);

    // Publication
    pushToGitHub();
    publishToNpm(newVersion);

    // Success
    showSuccessMessage(newVersion);

  } catch (error) {
    log(`\n❌ Error: ${error.message}`, 'red');
    log('\n🔧 Troubleshooting:', 'yellow');
    log('1. Ensure you are logged in to npm: npm login', 'yellow');
    log('2. Check git status and commit changes', 'yellow');
    log('3. Verify all tests pass: npm test', 'yellow');
    log('4. Check network connectivity', 'yellow');
    process.exit(1);
  }
}

// Show usage help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🚀 npm Publish Automation Script

Usage:
  node publish.js [version-type]

Version Types:
  patch     - Bug fixes (0.1.1 → 0.1.2)
  minor     - New features (0.1.1 → 0.2.0)
  major     - Breaking changes (0.1.1 → 1.0.0)
  prerelease- Pre-release (0.1.1 → 0.1.2-0)

Examples:
  node publish.js          # patch version (default)
  node publish.js minor    # minor version
  node publish.js major    # major version

The script will:
1. ✅ Validate git status and package.json
2. 🔨 Build the project
3. 🧪 Run all tests
4. 📈 Update version in package.json
5. 🏷️  Create git tag
6. 📤 Push to GitHub
7. 🚀 Publish to npmjs
`);
  process.exit(0);
}

// Run the main function
main();
