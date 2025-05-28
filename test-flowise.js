#!/usr/bin/env node

/**
 * Test script for Flowise n8n node
 * This script tests the basic functionality and API integration
 */

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Test configuration
const TEST_CONFIG = {
  flowiseUrl: process.env.FLOWISE_URL || 'http://localhost:3000',
  apiKey: process.env.FLOWISE_API_KEY || '',
  chatflowId: process.env.FLOWISE_CHATFLOW_ID || 'test-chatflow-id'
};

console.log('🧪 Flowise n8n Node Test Suite');
console.log('================================');

// Test 1: Check if build artifacts exist
function testBuildArtifacts() {
  console.log('\n📦 Testing build artifacts...');

  const requiredFiles = [
    'dist/credentials/FlowiseApi.credentials.js',
    'dist/nodes/Flowise/Flowise.node.js',
    'dist/nodes/Flowise/Flowise.node.json',
    'dist/nodes/Flowise/flowise.svg'
  ];

  let allExist = true;
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file} exists`);
    } else {
      console.log(`❌ ${file} missing`);
      allExist = false;
    }
  });

  return allExist;
}

// Test 2: Validate package.json configuration
function testPackageConfig() {
  console.log('\n📋 Testing package.json configuration...');

  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const n8nConfig = packageJson.n8n;

    // Check credentials
    const expectedCredentials = ['dist/credentials/FlowiseApi.credentials.js'];
    const hasFlowiseCredentials = n8nConfig.credentials.some(cred =>
      cred.includes('FlowiseApi.credentials.js')
    );

    if (hasFlowiseCredentials) {
      console.log('✅ Flowise credentials configured');
    } else {
      console.log('❌ Flowise credentials missing');
      return false;
    }

    // Check nodes
    const hasFlowiseNode = n8nConfig.nodes.some(node =>
      node.includes('Flowise.node.js')
    );

    if (hasFlowiseNode) {
      console.log('✅ Flowise node configured');
    } else {
      console.log('❌ Flowise node missing');
      return false;
    }

    return true;
  } catch (error) {
    console.log(`❌ Error reading package.json: ${error.message}`);
    return false;
  }
}

// Test 3: Test API connectivity (if Flowise is running)
async function testApiConnectivity() {
  console.log('\n🌐 Testing API connectivity...');

  try {
    const response = await fetch(`${TEST_CONFIG.flowiseUrl}/api/v1/version`);

    if (response.ok) {
      const data = await response.text();
      console.log(`✅ Flowise API accessible - Version: ${data}`);
      return true;
    } else {
      console.log(`⚠️  Flowise API returned status ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`⚠️  Flowise API not accessible: ${error.message}`);
    console.log('   This is expected if Flowise is not running locally');
    return false;
  }
}

// Test 4: Validate node structure
function testNodeStructure() {
  console.log('\n🔍 Testing node structure...');

  try {
    const nodeContent = fs.readFileSync('dist/nodes/Flowise/Flowise.node.js', 'utf8');

    // Check for key components
    const checks = [
      { name: 'Class export', pattern: /exports\.Flowise/ },
      { name: 'Node description', pattern: /displayName.*Flowise/ },
      { name: 'Credentials reference', pattern: /flowiseApi/ },
      { name: 'Resource options', pattern: /chat.*vectorStore/s },
      { name: 'Request routing', pattern: /routing/ }
    ];

    let allValid = true;
    checks.forEach(check => {
      if (check.pattern.test(nodeContent)) {
        console.log(`✅ ${check.name} found`);
      } else {
        console.log(`❌ ${check.name} missing`);
        allValid = false;
      }
    });

    return allValid;
  } catch (error) {
    console.log(`❌ Error validating node structure: ${error.message}`);
    return false;
  }
}

// Test 5: Validate credentials structure
function testCredentialsStructure() {
  console.log('\n🔑 Testing credentials structure...');

  try {
    const credContent = fs.readFileSync('dist/credentials/FlowiseApi.credentials.js', 'utf8');

    const checks = [
      { name: 'Class export', pattern: /exports\.FlowiseApi/ },
      { name: 'Base URL property', pattern: /baseUrl/ },
      { name: 'API Key property', pattern: /apiKey/ },
      { name: 'Authentication config', pattern: /authenticate/ },
      { name: 'Test endpoint', pattern: /\/api\/v1\/version/ }
    ];

    let allValid = true;
    checks.forEach(check => {
      if (check.pattern.test(credContent)) {
        console.log(`✅ ${check.name} found`);
      } else {
        console.log(`❌ ${check.name} missing`);
        allValid = false;
      }
    });

    return allValid;
  } catch (error) {
    console.log(`❌ Error validating credentials structure: ${error.message}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log(`\n🔧 Test Configuration:`);
  console.log(`   Flowise URL: ${TEST_CONFIG.flowiseUrl}`);
  console.log(`   API Key: ${TEST_CONFIG.apiKey ? '***configured***' : 'not configured'}`);

  const results = {
    buildArtifacts: testBuildArtifacts(),
    packageConfig: testPackageConfig(),
    nodeStructure: testNodeStructure(),
    credentialsStructure: testCredentialsStructure(),
    apiConnectivity: await testApiConnectivity()
  };

  console.log('\n📊 Test Results Summary:');
  console.log('========================');

  let passed = 0;
  let total = 0;

  Object.entries(results).forEach(([test, result]) => {
    total++;
    if (result) {
      passed++;
      console.log(`✅ ${test}: PASSED`);
    } else {
      console.log(`❌ ${test}: FAILED`);
    }
  });

  console.log(`\n🎯 Overall: ${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('🎉 All tests passed! Your Flowise node is ready to use.');
  } else {
    console.log('⚠️  Some tests failed. Please review the issues above.');
  }

  // Next steps
  console.log('\n📝 Next Steps:');
  console.log('==============');
  console.log('1. Start your Flowise instance if not running');
  console.log('2. Install this node in n8n using: npm install path/to/this/package');
  console.log('3. Configure Flowise credentials in n8n');
  console.log('4. Create a workflow with the Flowise node');
  console.log('5. Test chat operations with your chatflows');

  return passed === total;
}

// Add fetch polyfill for older Node.js versions
if (typeof fetch === 'undefined') {
  console.log('⚠️  Adding fetch polyfill...');
  global.fetch = require('node-fetch');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test runner error:', error);
  process.exit(1);
});