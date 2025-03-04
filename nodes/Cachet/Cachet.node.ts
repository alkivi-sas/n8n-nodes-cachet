import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Cachet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cachet',
		name: 'cachet',
		icon: 'file:cachet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Get data from Cachet API',
		defaults: {
				name: 'Cachet',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
				{
						name: 'cachetApi',
						required: true,
				},
		],
		requestDefaults: {
			// The baseURL is now dynamically taken from the credentials 'domain' field.
			baseURL: '={{$credentials.domain}}',
			url: '',
			headers: {
				'X-Cachet-Token': '={{$credentials.token}}',
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
                        name: 'Incident',
                        value: 'incident',
                    },
                ],
                default: 'incident',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: [
                            'incident',
                        ],
                    },
                },
                options: [
                    {
                        name: 'List',
                        value: 'list',
                        action: 'List incidents',
                        description: 'Get the list of incidents',
                        routing: {
                            request: {
                                method: 'GET',
                                url: '/incidents',
                            },
                        },
                    },
										{
											name: 'Get',
											value: 'get',
											action: 'Get incident',
											description: 'Get a specific incident',
											routing: {
												request: {
													method: 'GET',
													url: '={{"/incidents/" + $parameter.incidentId}}',
												},
											},
										},
										{
											name: 'Update',
											value: 'update',
											action: 'Update incident',
											description: 'Update a specific incident',
											routing: {
												request: {
													method: 'PUT',
													url: '={{"/incidents/" + $parameter.incidentId}}',
													// Parse the provided JSON update data:
													body: '={{$json.parse($parameter["updateData"])}}',
												},
											},
										},
										{
											name: 'Delete',
											value: 'delete',
											action: 'Delete incident',
											description: 'Delete a specific incident',
											routing: {
												request: {
													method: 'DELETE',
													url: '={{"/incidents/" + $parameter.incidentId}}',
												},
											},
										},
									],
								default: 'list',
            },
						{
							displayName: 'Incident ID',
							name: 'incidentId',
							type: 'string',
							default: '',
							required: true,
							displayOptions: {
								show: {
									resource: [
										'incident',
									],
									operation: [
										'get',
										'update',
										'delete',
									],
								},
							},
							description: 'The ID of the incident',
						},
						{
							displayName: 'Update Data (JSON)',
							name: 'updateData',
							type: 'json',
							default: '{}',
							required: true,
							displayOptions: {
								show: {
									resource: [
										'incident',
									],
									operation: [
										'update',
									],
								},
							},
							description: 'JSON data for updating the incident',
						},
		],

	};
}

