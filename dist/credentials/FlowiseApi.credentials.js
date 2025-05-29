"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlowiseApi = void 0;
class FlowiseApi {
    constructor() {
        this.name = 'FlowiseApi';
        this.displayName = 'Flowise API';
        this.documentationUrl = 'https://docs.flowiseai.com/using-flowise/api';
        this.properties = [
            {
                displayName: 'Base URL',
                name: 'baseUrl',
                type: 'string',
                default: 'http://localhost:3000',
                placeholder: 'http://localhost:3000',
                description: 'The base URL of your Flowise instance',
            },
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: {
                    password: true,
                },
                default: '',
                description: 'The API key for your Flowise instance (optional)',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '={{"Bearer " + $credentials.apiKey}}',
                },
            },
        };
        this.test = {
            request: {
                baseURL: '={{$credentials?.baseUrl}}',
                url: '/api/v1/version',
                method: 'GET',
            },
        };
    }
}
exports.FlowiseApi = FlowiseApi;
//# sourceMappingURL=FlowiseApi.credentials.js.map