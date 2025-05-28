#!/usr/bin/env node

/**
 * Post-installation verification script for n8n-nodes-flowise
 * This script verifies that the package was installed correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 n8n-nodes-flowise Installation Verification');
console.log('==============================================');

// Check if we're in node_modules or local development
const isInNodeModules = __dirname.includes('node_modules');
const packagePath = isInNodeModules
  ? path.join(__dirname, '../../')
  : __dirname;

console.log(`📍 Package location: ${packagePath}`);

// Verify package.json
const packageJsonPath = path.join(packagePath, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  console.log(`✅ Package: ${pkg.name}@${pkg.version}`);

  // Check n8n configuration
  if (pkg.n8n && pkg.n8n.nodes && pkg.n8n.credentials) {
    console.log(`✅ n8n configuration found`);
    console.log(`   - Nodes: ${pkg.n8n.nodes.length}`);
    console.log(`   - Credentials: ${pkg.n8n.credentials.length}`);
  } else {
    console.log(`❌ n8n configuration missing`);
  }
} else {
  console.log(`❌ package.json not found`);
}

// Verify dist directory structure
const distPath = path.join(packagePath, 'dist');
if (fs.existsSync(distPath)) {
  console.log(`✅ dist directory found`);

  // Check Flowise node
  const flowiseNodePath = path.join(distPath, 'nodes/Flowise/Flowise.node.js');
  if (fs.existsSync(flowiseNodePath)) {
    console.log(`✅ Flowise node found`);
  } else {
    console.log(`❌ Flowise node missing`);
  }

  // Check Flowise credentials
  const flowiseCredPath = path.join(distPath, 'credentials/FlowiseApi.credentials.js');
  if (fs.existsSync(flowiseCredPath)) {
    console.log(`✅ Flowise credentials found`);
  } else {
    console.log(`❌ Flowise credentials missing`);
  }

} else {
  console.log(`❌ dist directory not found`);
}

// Installation success
console.log('');
console.log('🎉 Installation verification complete!');
console.log('');
console.log('📚 Next steps:');
console.log('1. Restart your n8n instance');
console.log('2. Look for "Flowise" in the node palette');
console.log('3. Configure Flowise credentials in n8n settings');
console.log('4. Create a workflow with the Flowise node');
console.log('');
console.log('📖 Documentation: https://github.com/datproto/n8n-nodes-flowise');
console.log('🐛 Issues: https://github.com/datproto/n8n-nodes-flowise/issues');
