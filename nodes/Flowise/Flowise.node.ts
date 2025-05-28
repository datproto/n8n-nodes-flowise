import { INodeType, INodeTypeDescription, NodeConnectionType } from 'n8n-workflow';

export class Flowise implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Flowise',
    name: 'flowise',
    icon: 'file:flowise.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with Flowise AI workflows and chatflows',
    defaults: {
      name: 'Flowise',
    },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [
      {
        name: 'flowiseApi',
        required: false,
      },
    ],
    requestDefaults: {
      baseURL: '={{$credentials?.baseUrl || "http://localhost:3000"}}',
      url: '',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    },
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Chat',
            value: 'chat',
            description: 'Interact with Flowise chatflows',
          },
          {
            name: 'Vector Store',
            value: 'vectorStore',
            description: 'Manage vector store operations',
          },
        ],
        default: 'chat',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['chat'],
          },
        },
        options: [
          {
            name: 'Send Message',
            value: 'sendMessage',
            description: 'Send a message to a Flowise chatflow',
            action: 'Send a message to chatflow',
            routing: {
              request: {
                method: 'POST',
                url: '=/api/v1/prediction/{{$parameter["chatflowId"]}}',
              },
            },
          },
        ],
        default: 'sendMessage',
      },
      {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
          show: {
            resource: ['vectorStore'],
          },
        },
        options: [
          {
            name: 'Upsert Document',
            value: 'upsertDocument',
            description: 'Upload and process documents in vector store',
            action: 'Upsert document to vector store',
            routing: {
              request: {
                method: 'POST',
                url: '=/api/v1/vector/upsert/{{$parameter["chatflowId"]}}',
              },
            },
          },
        ],
        default: 'upsertDocument',
      },
      // Chat flow parameters
      {
        displayName: 'Chatflow ID',
        name: 'chatflowId',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'e.g., 12345678-1234-1234-1234-123456789012',
        description: 'The ID of the Flowise chatflow to interact with',
        displayOptions: {
          show: {
            resource: ['chat', 'vectorStore'],
          },
        },
      },
      {
        displayName: 'Question',
        name: 'question',
        type: 'string',
        required: true,
        default: '',
        placeholder: 'Enter your question or message',
        description: 'The question or message to send to the chatflow',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        routing: {
          send: {
            type: 'body',
            property: 'question',
          },
        },
      },
      // Session Management
      {
        displayName: 'Session ID',
        name: 'sessionId',
        type: 'string',
        default: '',
        placeholder: 'Optional session ID for conversation persistence',
        description: 'Session ID to maintain conversation state across multiple calls',
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        routing: {
          send: {
            type: 'body',
            property: 'overrideConfig.sessionId',
          },
        },
      },
      // Additional Options
      {
        displayName: 'Additional Options',
        name: 'additionalOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['chat'],
            operation: ['sendMessage'],
          },
        },
        options: [
          {
            displayName: 'Return Source Documents',
            name: 'returnSourceDocuments',
            type: 'boolean',
            default: false,
            description: 'Whether to return the source documents used to generate the response',
            routing: {
              send: {
                type: 'body',
                property: 'overrideConfig.returnSourceDocuments',
              },
            },
          },
          {
            displayName: 'Custom Variables',
            name: 'customVariables',
            type: 'fixedCollection',
            typeOptions: {
              multipleValues: true,
            },
            default: {},
            description: 'Custom variables to pass to the chatflow',
            options: [
              {
                name: 'variable',
                displayName: 'Variable',
                values: [
                  {
                    displayName: 'Name',
                    name: 'name',
                    type: 'string',
                    default: '',
                    description: 'Variable name',
                  },
                  {
                    displayName: 'Value',
                    name: 'value',
                    type: 'string',
                    default: '',
                    description: 'Variable value',
                    routing: {
                      send: {
                        property: '=overrideConfig.vars.{{$parent.name}}',
                        type: 'body',
                      },
                    },
                  },
                ],
              },
            ],
          },
          {
            displayName: 'Chat History',
            name: 'chatHistory',
            type: 'fixedCollection',
            typeOptions: {
              multipleValues: true,
            },
            default: {},
            description: 'Previous conversation messages for context',
            options: [
              {
                name: 'message',
                displayName: 'Message',
                values: [
                  {
                    displayName: 'Role',
                    name: 'role',
                    type: 'options',
                    options: [
                      {
                        name: 'User Message',
                        value: 'userMessage',
                      },
                      {
                        name: 'API Message',
                        value: 'apiMessage',
                      },
                    ],
                    default: 'userMessage',
                    description: 'The role of the message sender',
                  },
                  {
                    displayName: 'Content',
                    name: 'content',
                    type: 'string',
                    default: '',
                    description: 'The message content',
                  },
                ],
              },
            ],
            routing: {
              send: {
                type: 'body',
                property: 'history',
                value: '={{$parameter.chatHistory.message}}',
              },
            },
          },
        ],
      },
      // Vector Store specific options
      {
        displayName: 'Document Upload Options',
        name: 'documentOptions',
        type: 'collection',
        placeholder: 'Add Option',
        default: {},
        displayOptions: {
          show: {
            resource: ['vectorStore'],
            operation: ['upsertDocument'],
          },
        },
        options: [
          {
            displayName: 'Return Source Documents',
            name: 'returnSourceDocuments',
            type: 'boolean',
            default: false,
            description: 'Whether to return the processed source documents',
            routing: {
              send: {
                type: 'body',
                property: 'returnSourceDocuments',
              },
            },
          },
          {
            displayName: 'Chat ID',
            name: 'chatId',
            type: 'string',
            default: '',
            description: 'Optional chat ID to associate with the upload',
            routing: {
              send: {
                type: 'body',
                property: 'chatId',
              },
            },
          },
        ],
      },
    ],
  };
}
