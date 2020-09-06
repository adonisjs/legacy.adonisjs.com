// @ts-check
const { join } = require('path')
const { cwd } = require('process')
const fs = require('fs-extra')
const readdirp = require('readdirp')
const matter = require('gray-matter')
const { Edge, GLOBALS } = require('edge.js')
const { Renderer, utils, component } = require('dimer-edge')
const { ShikiRenderer } = require('dimer-edge-shiki')
const Markdown = require('@dimerapp/markdown')
const Menu = require('../menu.js')

// Paths
const contentsPath = join(cwd(), 'contents')
const pagesPath = join(cwd(), 'pages')
const staticPath = join(cwd(), 'static')
const buildPath = join(cwd(), 'build')
const guidesPath = join(contentsPath, 'guides')
const markdownPagesPath = join(contentsPath, 'pages')
const blogPagesPath = join(contentsPath, 'blog')

/**
 * Preparing a custom instance of edge with
 * multiple renderers attached to it.
 */
async function prepareEdge() {
	const edge = new Edge({ cache: false })
	edge.mount(pagesPath)

	const shiki = new ShikiRenderer(__dirname)
	shiki.loadLanguage({ id: 'edge', scopeName: 'text.html.edge', path: './languages/edge.tmLanguage.json' })
	shiki.loadLanguage({ id: 'diff', scopeName: 'source.diff', path: './languages/diff.tmLanguage.json' })
	shiki.useTheme('material-theme-palenight')
	await shiki.boot()

	const renderer = new Renderer(edge)
	renderer.use(shiki.handleCodeBlocks)
	renderer.hook((node) => {
		// Code examples.
		if (utils.hasClass(node, 'dimer-highlight')) {
	 		return component('_elements/_code', { node })
		}

		// Tabbed code examples.
		if (utils.hasClass(node, 'tabs')) {
			const tabListItems = node.children[0].children[0].children.filter((li) => li.tag === 'li')
			const tabsContentPanes = node.children[1].children

			return component('_elements/_tabbed-example', {
				links: tabListItems.map(item => item.children[0].value),
				panes: tabsContentPanes
			})
		}

		// Alerts.
		if (utils.hasClass(node, 'alert')) {
			const type = node.props.className[1].split('-')[1]
			const color = type === 'note' ? 'adonis-brand' : type === 'tip' ? 'adonis-green' : 'adonis-red'

			return component('_elements/_alert', {
				node,
				type,
				color
			})
		}
	})

	return edge
}

/**
 * Clean the build directory.
 */
function cleanBuildDirectory() {
	return fs.remove(buildPath)
}

/**
 * Build all static Edge pages.
 */
async function buildEdgePages() {
	const edge = new Edge({ cache: false })
	edge.mount(pagesPath)

	for await (const entry of readdirp(pagesPath)) {
		if (entry.path.startsWith('_')) {
			continue
		}

		const html = edge.render(entry.path)

		await fs.outputFile(join(buildPath, entry.path.replace(/\.edge/, '.html')), html)
	}
}

/**
 * Build all pages from their markdown files.
 */
async function buildGuidePages() {
	const edge = await prepareEdge()

	for await (const entry of readdirp(guidesPath)) {
		const source = await fs.readFile(entry.fullPath)
		const { data: frontMatter, content } = matter(source)
		const markdown = new Markdown(content, { skipToc: true })
		const { contents } = await markdown.toJSON()
		const menu = Menu.guides[frontMatter.group]
		const categories = Object.keys(Menu.guides).map((key) => ({
			name: key,
			link: Menu.guides[key][0].link,
		}))

		const html = edge.render(`_guides.edge`, {
			frontMatter: {
				...frontMatter,
				title: contents.children[0].children[0].value,
			},
			menu,
			categories,
			content: contents,
		})

		await fs.outputFile(join(buildPath, `${frontMatter.permalink}.html`), html)
	}
}

async function buildMarkdownPages() {
	const edge = await prepareEdge()

	for await (const entry of readdirp(markdownPagesPath)) {
		const source = await fs.readFile(entry.fullPath)
		const { data: frontMatter, content } = matter(source)
		const markdown = new Markdown(content, { skipToc: true })
		const { contents } = await markdown.toJSON()

		const html = edge.render(`_pages.edge`, {
			frontMatter,
			content: contents,
		})

		await fs.outputFile(join(buildPath, `${frontMatter.permalink}.html`), html)
	}
}

async function buildBlogPages() {
	const edge = await prepareEdge()
	const blog = []

	for await (const entry of readdirp(blogPagesPath)) {
		const source = await fs.readFile(entry.fullPath)
		const { data: frontMatter, content } = matter(source)
		const markdown = new Markdown(content, { skipToc: true })
		const { contents } = await markdown.toJSON()
		const date = new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}).format(new Date(frontMatter.meta.published_on))

		const html = edge.render(`_posts.edge`, {
			frontMatter: {
				...frontMatter,
				published_on: date,
			},
			content: contents,
		})

		blog.push({
			title: frontMatter.title,
			order: frontMatter.meta.number,
			published_on: date,
			link: frontMatter.permalink,
		})

		await fs.outputFile(join(buildPath, `${frontMatter.permalink}.html`), html)
	}

	const html = edge.render(`_blog.edge`, {
		blog: blog.sort((a, b) => b.order - a.order),
	})

	await fs.outputFile(join(buildPath, `blog.html`), html)
}

/**
 * Copy all static file to the build directory.
 */
function copyStaticFiles() {
	return fs.copy(staticPath, buildPath)
}

;(async () => {
	// await cleanBuildDirectory()
	await buildEdgePages()
	await buildGuidePages()
	await buildMarkdownPages()
	await buildBlogPages()
	await copyStaticFiles()
})()
