# Flowise Node Usage Examples

This document provides practical examples of how to use the Flowise node in n8n workflows.

## Basic Chat Example

### Simple Q&A Workflow

1. **Manual Trigger** → **Flowise Node** → **Edit Fields**

```json
// Flowise Node Configuration
{
  "resource": "chat",
  "operation": "sendMessage", 
  "chatflowId": "your-chatflow-id-here",
  "message": "What is machine learning?"
}
```

### Response Processing

The Flowise node returns:
```json
{
  "text": "Machine learning is a subset of artificial intelligence...",
  "question": "What is machine learning?",
  "chatId": "chatflow-abc123",
  "sessionId": null
}
```

## Advanced Chat with Session Management

### Customer Support Bot

```json
// Flowise Node Configuration
{
  "resource": "chat",
  "operation": "sendMessage",
  "chatflowId": "customer-support-flow",
  "message": "{{ $json.customerMessage }}",
  "sessionId": "customer-{{ $json.customerId }}",
  "vars": {
    "customerName": "{{ $json.customerName }}",
    "accountType": "{{ $json.accountType }}",
    "ticketId": "{{ $json.ticketId }}"
  },
  "overrideConfig": {
    "temperature": 0.3,
    "maxTokens": 500
  }
}
```

## Vector Store Operations

### Document Upload Workflow

```json
// Flowise Node Configuration  
{
  "resource": "vectorStore",
  "operation": "upsertDocument",
  "chatflowId": "document-store-flow",
  "document": "{{ $json.documentContent }}",
  "metadata": {
    "source": "{{ $json.source }}",
    "category": "{{ $json.category }}",
    "timestamp": "{{ $now }}",
    "userId": "{{ $json.userId }}"
  }
}
```

## Real-World Workflow Examples

### 1. AI-Powered Email Response

**Trigger**: Email Received (IMAP)
↓
**HTTP Request**: Parse email content
↓
**Flowise Node**: Generate response
```json
{
  "resource": "chat",
  "operation": "sendMessage",
  "chatflowId": "email-assistant",
  "message": "Generate a professional response to: {{ $json.emailBody }}",
  "vars": {
    "senderName": "{{ $json.fromName }}",
    "subject": "{{ $json.subject }}",
    "urgency": "{{ $json.priority }}"
  }
}
```
↓
**Gmail**: Send reply

### 2. Knowledge Base Chat with History

**Webhook Trigger**: User asks question
↓
**Function**: Retrieve chat history
↓
**Flowise Node**: Answer with context
```json
{
  "resource": "chat", 
  "operation": "sendMessage",
  "chatflowId": "knowledge-base",
  "message": "{{ $json.question }}",
  "sessionId": "user-{{ $json.userId }}",
  "history": "{{ $json.previousMessages }}",
  "vars": {
    "userRole": "{{ $json.userRole }}",
    "department": "{{ $json.department }}"
  }
}
```
↓
**Function**: Save response to history
↓
**HTTP Response**: Return answer

### 3. Document Analysis Pipeline

**Schedule Trigger**: Daily at 9 AM
↓
**Google Drive**: List new documents
↓
**Google Drive**: Download document content
↓
**Flowise Node**: Process document
```json
{
  "resource": "vectorStore",
  "operation": "upsertDocument", 
  "chatflowId": "document-analyzer",
  "document": "{{ $json.documentText }}",
  "metadata": {
    "filename": "{{ $json.fileName }}",
    "uploadDate": "{{ $json.createdTime }}",
    "fileType": "{{ $json.mimeType }}",
    "processed": true
  }
}
```
↓
**Slack**: Notify team of processing completion

### 4. Multi-Language Support

**Webhook**: Receive message
↓
**Function**: Detect language
↓
**Flowise Node**: Respond in detected language
```json
{
  "resource": "chat",
  "operation": "sendMessage",
  "chatflowId": "multilingual-support",
  "message": "{{ $json.userMessage }}",
  "vars": {
    "responseLanguage": "{{ $json.detectedLanguage }}",
    "userLocation": "{{ $json.country }}"
  },
  "overrideConfig": {
    "systemMessage": "Respond in {{ $json.detectedLanguage }} language"
  }
}
```

## Error Handling Patterns

### Retry Logic
```json
// Function Node - Retry Logic
if ($input.first().json.error) {
  // Log error and retry with different parameters
  return [{
    retryCount: ($json.retryCount || 0) + 1,
    originalMessage: $json.message,
    fallbackChatflow: "simple-qa-flow"
  }];
}
```

### Fallback Chatflow
```json
// Flowise Node - Fallback Configuration
{
  "chatflowId": "{{ $json.retryCount > 2 ? $json.fallbackChatflow : $json.originalChatflow }}",
  "message": "{{ $json.originalMessage }}",
  "overrideConfig": {
    "temperature": 0.1  // More conservative for fallback
  }
}
```

## Best Practices

### 1. Session Management
- Use consistent session IDs for conversation continuity
- Include user identifiers in session IDs
- Clear sessions periodically for privacy

### 2. Variable Usage
- Pass relevant context through `vars`
- Use descriptive variable names
- Validate variables before sending

### 3. Error Handling
- Always include error handling nodes
- Log failed requests for debugging
- Implement fallback responses

### 4. Performance
- Cache frequently used responses
- Use appropriate chatflow configurations
- Monitor response times and adjust timeouts

### 5. Security
- Validate user inputs before sending to Flowise
- Use session management for user isolation
- Don't log sensitive information

## Credential Configuration Examples

### Local Development
```json
{
  "baseUrl": "http://localhost:3000",
  "apiKey": ""  // Empty for local development
}
```

### Production with API Key
```json
{
  "baseUrl": "https://your-flowise-instance.com",
  "apiKey": "your-secret-api-key-here"
}
```

### Docker Deployment
```json
{
  "baseUrl": "http://flowise:3000",  // Docker service name
  "apiKey": "${FLOWISE_API_KEY}"     // Environment variable
}
```

## Troubleshooting Common Issues

### 1. "Chatflow not found" Error
- Verify chatflow ID is correct
- Ensure chatflow is deployed in Flowise
- Check API endpoint accessibility

### 2. Authentication Failures
- Verify API key if required
- Check base URL configuration
- Test credentials using the built-in test

### 3. Session Issues
- Ensure session IDs are consistent
- Check for special characters in session IDs
- Verify session storage in Flowise

### 4. Variable Not Working
- Check variable names match chatflow expectations
- Verify JSON format for complex variables
- Test variables directly in Flowise UI first
