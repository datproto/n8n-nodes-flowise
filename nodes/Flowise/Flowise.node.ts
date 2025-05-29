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
        required: true,
      },
    ],
    requestDefaults: {
      baseURL: "={{$credentials?.baseUrl || 'http://localhost:3000'}}",
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
      }
    ]
  }
}
