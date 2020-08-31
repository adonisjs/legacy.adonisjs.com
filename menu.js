module.exports = {
	guides: {
		Basics: [
			{ name: 'Quick Start', link: 'quick-start' },
			{ name: 'Directory Structure', link: 'directory-structure' },
			{
				name: 'Handling HTTP Requests',
				children: [
					{ name: 'Introduction', link: 'http/introduction' },
					{ name: 'Routing', link: 'http/routing' },
					{ name: 'Controllers', link: 'http/controllers' },
					{ name: 'Views and Templates', link: 'http/views-and-templates' },
					{ name: 'File Uploads', link: 'http/file-uploads' },
					{ name: 'Sessions', link: 'http/sessions' },
					{ name: 'Middleware', link: 'http/middleware' },
					{ name: 'Exceptions Handling', link: 'http/exception-handling' },
					{ name: 'URL Generation', link: 'http/url-generate' },
					{ name: 'Content Negotiation', link: 'http/content-negotiation' },
					{ name: 'Static Files', link: 'http/static-files' },
				],
			},
			{
				name: 'Additional Resources',
				children: [
					{ name: 'CSRF Protection', link: 'csrf-protection' }
				],
			},
		],
		Authentication: [
			{ name: 'Introduction', link: 'auth/introduction' },
			{ name: 'Setup', link: 'auth/setup' },
			{ name: 'Web Guard', link: 'auth/web-guard' },
			{ name: 'API Guard', link: 'auth/api-guard' },
			{ name: 'Basic Auth Guard', link: 'auth/basic-auth-guard' },
			{ name: 'Middleware', link: 'auth/middleware' },
			{ name: 'Handling Exceptions', link: 'auth/handling-exceptions' },
		],
		Database: [
			{ name: 'Introduction', link: 'database/introduction' },
			{ name: 'Setup', link: 'database/setup' },
			{ name: 'Query Builder', link: 'database/query-builder' },
			{ name: 'Pagination', link: 'database/pagination' },
			{ name: 'Debugging Queries', link: 'database/debugging-queries' },
			{ name: 'Transactions', link: 'database/transactions' },
			{ name: 'Schema Migrations', link: 'database/migrations' },
			{ name: 'Model Factories', link: 'database/factories' },
			{ name: 'Database Seeding', link: 'database/seeds' },
			{
				name: 'Data Models',
				children: [
					{ name: 'Introduction', link: 'models/introduction' },
					{ name: 'CRUD Operations', link: 'models/crud-operations' },
					{ name: 'Columns', link: 'models/columns' },
					{ name: 'Hooks', link: 'models/hooks' },
					{ name: 'Query Scopes', link: 'models/query-scopes' },
					{ name: 'Serializing Models', link: 'models/serializing-models' },
				],
			},
			{
				name: 'Relationships',
				children: [
					{ name: 'Introduction', link: 'model-relations/introduction' },
					{ name: 'Has One', link: 'model-relations/has-one' },
					{ name: 'Has Many', link: 'model-relations/has-many' },
					{ name: 'Belongs To', link: 'model-relations/belongs-to' },
					{ name: 'Many to Many', link: 'model-relations/many-to-many' },
					{ name: 'Has Many Through', link: 'model-relations/has-many-through' },
				],
			},
			{
				name: 'Advanced Concepts',
				children: [
					{ name: 'Connections Management', link: 'database/connections-management' },
				],
			},
		],
		// Security: [],
		Validator: [
			{ name: 'Introduction', link: 'validator/introduction' },
			{ name: 'Usage', link: 'validator/usage' },
			{ name: 'Schema Type', link: 'validator/schema-types' },
			{ name: 'Validation Rules', link: 'validator/rules' },
			{ name: 'Custom Messages', link: 'validator/custom-messages' },
			{ name: 'Error Reporters', link: 'validator/error-reporters' },
			{ name: 'Schema Caching', link: 'validator/schema-caching' },
			{ name: 'Custom Rules', link: 'validator/custom-rules' },
		],
		'Views & Templates': [
			{ name: 'Introduction', link: 'views/introduction' },
			{ name: 'Data Flow', link: 'views/data-flow' },
			{ name: 'Interpolation', link: 'views/interpolation' },
			{ name: 'Conditionals', link: 'views/conditionals' },
			{ name: 'Loops', link: 'views/loops' },
			{ name: 'Layouts', link: 'views/layouts' },
			{ name: 'Partials', link: 'views/partials' },
			{ name: 'Components', link: 'views/components' },
			{ name: 'In-Memory Views', link: 'views/in-memory-views' },
			{ name: 'Debugging', link: 'views/debugging' },
			{
				name: 'References',
				children: [
					{ name: 'Globals', link: 'views/globals' },
					{ name: 'Tags Reference', link: 'views/tags' },
					{ name: 'Views API', link: 'views/api' },
				],
			}
		],
		'Digging Deeper': [
			{ name: 'Events', link: 'events' },
			{ name: 'Health Checks', link: 'health-check' },
			{ name: 'Logger', link: 'logger' },
			{ name: 'Mail', link: 'mail' },
			{ name: 'Redis', link: 'database/redis' },
		],
	},
}
