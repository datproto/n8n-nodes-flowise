#!/usr/bin/env node

const fs = require('fs');

console.log('🔍 Testing Flowise Node Loading Compatibility\n');

try {
  console.log('📦 Loading compiled node...');
  const NodeClass = require('./dist/nodes/Flowise/Flowise.node.js');
  
  if (!NodeClass.Flowise) {
    throw new Error('Flowise class not exported properly');
  }
  
  console.log('✅ Node class loaded successfully');
  
  const nodeInstance = new NodeClass.Flowise();
  
  if (!nodeInstance.description) {
    throw new Error('Node description not found');
  }
  
  console.log('✅ Node instance created successfully');
  
  const description = nodeInstance.description;
  
  const requiredProps = ['displayName', 'name', 'group', 'version', 'inputs', 'outputs'];
  for (const prop of requiredProps) {
    if (!description[prop]) {
      throw new Error('Missing required property: ' + prop);
    }
  }
  
  console.log('✅ All required properties present');
  
  if (typeof nodeInstance.execute !== 'function') {
    throw new Error('Execute method not found or not a function');
  }
  
  console.log('✅ Execute method found');
  
  const metadata = JSON.parse(fs.readFileSync('./dist/nodes/Flowise/Flowise.node.json', 'utf8'));
  
  if (!metadata.node || !metadata.node.endsWith('.js')) {
    throw new Error('Invalid node reference in metadata');
  }
  
  console.log('✅ Node metadata valid');
  
  console.log('\n🎉 Node Loading Test Results:');
  console.log('✅ Node loads correctly');
  console.log('✅ Node instantiates properly');
  console.log('✅ All required properties present');
  console.log('✅ Execute method implemented');
  console.log('✅ Metadata correctly configured');
  
  console.log('\n📝 Node Details:');
  console.log('   Display Name: ' + description.displayName);
  console.log('   Internal Name: ' + description.name);
  console.log('   Version: ' + description.version);
  console.log('   Group: ' + description.group.join(', '));
  console.log('   Inputs: ' + description.inputs.length);
  console.log('   Outputs: ' + description.outputs.length);
  console.log('   Credentials: ' + (description.credentials ? description.credentials.length : 0));
  
  console.log('\n🚀 The node should now appear in n8n!\n');
  
} catch (error) {
  console.error('❌ Node loading test failed:', error.message);
  process.exit(1);
}
