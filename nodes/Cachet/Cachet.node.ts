import { INodeType, INodeTypeDescription } from 'n8n-workflow';

export class Cachet implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cachet',
		name: 'cachet',
		icon: 'file:cachet.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with the Cachet API using full support for pagination, sorting, filtering and authentication.',
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
		// Every request uses the domain and bearer token provided by the credentials.
		requestDefaults: {
			baseURL: '={{$credentials.domain}}',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
				Authorization: '={{"Bearer " + $credentials.token}}',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Component', value: 'component' },
					{ name: 'Incident', value: 'incident' },
					{ name: 'Metric', value: 'metric' },
					{ name: 'Schedule', value: 'schedule' },
					{ name: 'Subscriber', value: 'subscriber' },
				],
				default: 'incident',
				description: 'The Cachet resource to interact with',
			},
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create',
						value: 'create',
						action: 'Create resource',
						description: 'Create a new resource',
						routing: {
							request: {
								method: 'POST',
								url: '={{ "/" + $parameter.resource + "s" }}',
								body: '={{ $json.parse($parameter.data) }}',
							},
						},
					},
					{
						name: 'Delete',
						value: 'delete',
						action: 'Delete resource',
						description: 'Delete a resource by ID',
						routing: {
							request: {
								method: 'DELETE',
								url: '={{ "/" + $parameter.resource + "s/" + $parameter.resourceId }}',
							},
						},
					},
					{
						name: 'Get',
						value: 'get',
						action: 'Get resource',
						description: 'Get a specific resource by ID',
						routing: {
							request: {
								method: 'GET',
								url: '={{ "/" + $parameter.resource + "s/" + $parameter.resourceId }}',
							},
						},
					},
					{
						name: 'List',
						value: 'list',
						action: 'List resources',
						description: 'List all resources with pagination, sorting and filtering',
						routing: {
							request: {
								method: 'GET',
								// Builds the query string dynamically using pagination and sorting/filtering options.
								url: '={{ "/" + $parameter.resource + "s" + "?" + "page=" + ($parameter.pagination.page || 1) + "&per_page=" + ($parameter.pagination.perPage || 25) + ($parameter.sortingFiltering.sort ? "&sort=" + $parameter.sortingFiltering.sort : "") + ($parameter.sortingFiltering.order ? "&order=" + $parameter.sortingFiltering.order : "") + ($parameter.sortingFiltering.filters ? "&" + $parameter.sortingFiltering.filters : "") }}',
							},
						},
					},
					{
						name: 'Update',
						value: 'update',
						action: 'Update resource',
						description: 'Update an existing resource',
						routing: {
							request: {
								method: 'PUT',
								url: '={{ "/" + $parameter.resource + "s/" + $parameter.resourceId }}',
								body: '={{ $json.parse($parameter.data) }}',
							},
						},
					},
				],
				default: 'list',
			},
			{
				displayName: 'Pagination',
				name: 'pagination',
				type: 'collection',
				placeholder: 'Add Pagination Options',
				default: {},
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Page',
						name: 'page',
						type: 'number',
						default: 1,
					},
					{
						displayName: 'Per Page',
						name: 'perPage',
						type: 'number',
						default: 25,
					},
				],
			},
			{
				displayName: 'Sorting & Filtering',
				name: 'sortingFiltering',
				type: 'collection',
				placeholder: 'Add Sorting & Filtering Options',
				default: {},
				displayOptions: {
					show: {
						operation: ['list'],
					},
				},
				options: [
					{
						displayName: 'Sort',
						name: 'sort',
						type: 'string',
						default: '',
					},
					{
						displayName: 'Order',
						name: 'order',
						type: 'options',
						options: [
							{ name: 'Ascending', value: 'asc' },
							{ name: 'Descending', value: 'desc' },
						],
						default: 'asc',
					},
					{
						displayName: 'Filters',
						name: 'filters',
						type: 'string',
						default: '',
						description:
							'Additional query parameters (e.g. "status=1&impact=high"). Enter in URL query string format.',
					},
				],
			},
			{
				displayName: 'Resource ID',
				name: 'resourceId',
				type: 'string',
				default: '',
				required: true,
				displayOptions: {
					show: {
						operation: ['get', 'update', 'delete'],
					},
				},
			},
			{
				displayName: 'Data (JSON)',
				name: 'data',
				type: 'json',
				default: '{}',
				required: true,
				displayOptions: {
					show: {
						operation: ['create', 'update'],
					},
				},
			},
		],
	};
}

