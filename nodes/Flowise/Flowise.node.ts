import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeConnectionType
} from 'n8n-workflow';

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

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const results: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      const resource = this.getNodeParameter('resource', i) as string;
      const operation = this.getNodeParameter('operation', i) as string;

      try {
        let responseData: any;

        if (resource === 'chat' && operation === 'sendMessage') {
          // The routing configuration in the description handles the API call
          // n8n will automatically make the HTTP request based on the routing config
          const question = this.getNodeParameter('question', i) as string;
          const chatflowId = this.getNodeParameter('chatflowId', i) as string;

          // Build request body
          const body: any = {
            question,
          };

          // Add optional parameters if provided
          const sessionId = this.getNodeParameter('sessionId', i, '') as string;
          if (sessionId) {
            body.overrideConfig = body.overrideConfig || {};
            body.overrideConfig.sessionId = sessionId;
          }

          const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;

          if (additionalOptions.returnSourceDocuments) {
            body.overrideConfig = body.overrideConfig || {};
            body.overrideConfig.returnSourceDocuments = additionalOptions.returnSourceDocuments;
          }

          if (additionalOptions.customVariables?.variable?.length) {
            body.overrideConfig = body.overrideConfig || {};
            body.overrideConfig.vars = {};

            for (const variable of additionalOptions.customVariables.variable) {
              if (variable.name && variable.value) {
                body.overrideConfig.vars[variable.name] = variable.value;
              }
            }
          }

          if (additionalOptions.chatHistory?.message?.length) {
            body.history = additionalOptions.chatHistory.message;
          }

          // Get credentials
          const credentials = await this.getCredentials('flowiseApi');
          const baseUrl = credentials?.baseUrl || 'http://localhost:3000';

          // Make the API request
          const response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/api/v1/prediction/${chatflowId}`,
            body,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            json: true,
          });

          responseData = response;

        } else if (resource === 'vectorStore' && operation === 'upsertDocument') {
          const chatflowId = this.getNodeParameter('chatflowId', i) as string;
          const documentOptions = this.getNodeParameter('documentOptions', i, {}) as any;

          // Build request body for vector store operation
          const body: any = {};

          if (documentOptions.returnSourceDocuments) {
            body.returnSourceDocuments = documentOptions.returnSourceDocuments;
          }

          if (documentOptions.chatId) {
            body.chatId = documentOptions.chatId;
          }

          // Get credentials
          const credentials = await this.getCredentials('flowiseApi');
          const baseUrl = credentials?.baseUrl || 'http://localhost:3000';

          // Make the API request
          const response = await this.helpers.httpRequest({
            method: 'POST',
            url: `${baseUrl}/api/v1/vector/upsert/${chatflowId}`,
            body,
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            json: true,
          });

          responseData = response;
        }

        results.push({
          json: responseData || {},
          pairedItem: { item: i },
        });

      } catch (error) {
        if (this.continueOnFail()) {
          results.push({
            json: { error: error.message },
            pairedItem: { item: i },
          });
        } else {
          throw error;
        }
      }
    }

    return [results];
  }
}
