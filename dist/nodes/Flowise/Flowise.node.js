"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flowise = void 0;
class Flowise {
    constructor() {
        this.description = {
            displayName: 'Flowise',
            name: 'Flowise',
            icon: 'file:flowise.svg',
            group: ['transform'],
            version: 1,
            subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
            description: 'Interact with Flowise AI workflows and chatflows',
            defaults: {
                name: 'Flowise',
            },
            inputs: ["main"],
            outputs: ["main"],
            credentials: [
                {
                    name: 'FlowiseApi',
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
        };
    }
}
exports.Flowise = Flowise;
//# sourceMappingURL=Flowise.node.js.map