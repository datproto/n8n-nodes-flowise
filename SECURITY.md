# Security Policy

## Supported Versions

We provide security updates for the following versions of n8n-nodes-flowise:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please send an email to [contact@dataproto.com](mailto:contact@dataproto.com).

Please include the following information:
- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

## Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours.
- **Status Updates**: We will provide status updates on the resolution progress within 7 days.
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days.

## Security Best Practices

When using n8n-nodes-flowise:

1. **API Keys**: Store Flowise API keys securely using n8n's credential system
2. **Network Security**: Use HTTPS connections to Flowise instances
3. **Access Control**: Limit access to n8n workflows containing sensitive operations
4. **Input Validation**: Validate all inputs before sending to Flowise
5. **Error Handling**: Avoid exposing sensitive information in error messages
6. **Updates**: Keep the package updated to the latest version

## Common Security Considerations

- **Data Privacy**: Be aware of what data you're sending to Flowise instances
- **Authentication**: Use proper authentication methods (API keys, Bearer tokens)
- **Rate Limiting**: Implement appropriate rate limiting for API calls
- **Logging**: Be careful about logging sensitive information

## Contact

For security-related questions or concerns:
- Email: contact@dataproto.com
- GitHub: Create a private security advisory on this repository

Thank you for helping keep n8n-nodes-flowise and its users safe!
