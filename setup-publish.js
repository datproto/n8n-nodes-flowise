#!/usr/bin/env node

/**
 * Pre-publish setup checker
 * Validates that the environment is ready for publishing
 */

const { execSync } = require('child_process');

function exec(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).toString().trim();
  } catch (error) {
    return null;
  }
}

function checkNpmLogin() {
  console.log('🔐 Checking npm authentication...');

  const user = exec('npm whoami');
  if (user) {
    console.log(`✅ Logged in as: ${user}`);
    return true;
  } else {
    console.log('❌ Not logged in to npm');
    return false;
  }
}

function checkGitConfig() {
  console.log('📝 Checking git configuration...');

  const name = exec('git config user.name');
  const email = exec('git config user.email');

  if (name && email) {
    console.log(`✅ Git configured as: ${name} <${email}>`);
    return true;
  } else {
    console.log('❌ Git user not configured');
    return false;
  }
}

function checkGitRemote() {
  console.log('🌐 Checking git remote...');

  const remote = exec('git remote get-url origin');
  if (remote) {
    console.log(`✅ Remote configured: ${remote}`);
    return true;
  } else {
    console.log('❌ No git remote configured');
    return false;
  }
}

function showSetupInstructions() {
  console.log('\n📋 Setup Instructions:');
  console.log('════════════════════════');

  console.log('\n1. Configure npm authentication:');
  console.log('   npm login');
  console.log('   # Enter your npmjs credentials');

  console.log('\n2. Configure git (if needed):');
  console.log('   git config --global user.name "Your Name"');
  console.log('   git config --global user.email "your.email@example.com"');

  console.log('\n3. Configure git remote (if needed):');
  console.log('   git remote add origin https://github.com/datproto/n8n-nodes-flowise.git');

  console.log('\n4. Usage examples:');
  console.log('   npm run publish:patch    # 0.1.1 → 0.1.2');
  console.log('   npm run publish:minor    # 0.1.1 → 0.2.0');
  console.log('   npm run publish:major    # 0.1.1 → 1.0.0');
  console.log('   node publish.js --help   # Show detailed help');
}

console.log('🚀 npm Publish Setup Checker');
console.log('═══════════════════════════════\n');

const npmOk = checkNpmLogin();
const gitConfigOk = checkGitConfig();
const gitRemoteOk = checkGitRemote();

console.log('\n📊 Status Summary:');
console.log('═════════════════');
console.log(`npm authentication: ${npmOk ? '✅' : '❌'}`);
console.log(`git configuration: ${gitConfigOk ? '✅' : '❌'}`);
console.log(`git remote: ${gitRemoteOk ? '✅' : '❌'}`);

if (npmOk && gitConfigOk && gitRemoteOk) {
  console.log('\n🎉 All setup complete! Ready to publish.');
  console.log('\nRun: npm run publish:patch (or minor/major)');
} else {
  showSetupInstructions();
}
