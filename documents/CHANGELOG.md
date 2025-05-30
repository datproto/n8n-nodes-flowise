# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.6] - 2025-05-30

### Changed
- Updated node logo from placeholder SingleStore logo to custom Flowise-themed design
- New logo features blue gradient background with AI workflow node representation
- Logo now displays connected flow diagram representing AI processing workflow
- Added 'AI' text indicator in center of logo for better identification

## [0.1.5] - 2025-05-29

### Added
- Initial Flowise node implementation
- Support for Chat and Vector Store operations
- Bearer token authentication
- Session management and custom variables
- File upload support for documents
- Comprehensive error handling
- GitHub Actions CI/CD pipeline

### Changed
- Updated from npm to pnpm package manager
- Enhanced package.json for npm publishing

### Fixed
- TypeScript compilation issues
- ESLint configuration for publishing

## [0.1.0] - 2024-01-XX

### Added
- Initial release of n8n-nodes-flowise
- Flowise node with two main resources:
  - **Chat**: Send messages to Flowise chatflows
    - Session management support
    - Custom variables injection
    - Chat history tracking
    - File upload capabilities
  - **Vector Store**: Upsert documents to vector databases
    - Document upload and processing
    - Metadata support
    - Chunking and embedding
- FlowiseApi credentials with:
  - Bearer token authentication
  - Connection testing
  - Optional API key support
- Comprehensive test suite
- Complete documentation and usage examples
- GitHub Actions workflows for CI/CD
- npm publishing automation

### Technical Details
- Built with TypeScript
- Declarative-style n8n node implementation
- RESTful API integration with Flowise
- Support for n8n workflow automation
- Compatible with n8n API version 1

### Documentation
- README with installation and usage instructions
- PROJECT_SUMMARY with implementation details
- USAGE_EXAMPLES with real-world scenarios
- RELEASE_PROCESS documentation
