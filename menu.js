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
				],
			},
		],
		Authentication: [],
		Database: [],
		'Digging Deeper': [],
		Security: [],
		Validator: [],
		'Views & Templates': [],
	},
}
