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

const contentsPath = join(cwd(), 'contents')
const pagesPath = join(cwd(), 'pages')
const staticPath = join(cwd(), 'static')
const buildPath = join(cwd(), 'build')
const guidesPath = join(contentsPath, 'guides')
const markdownPagesPath = join(contentsPath, 'pages')
const blogPagesPath = join(contentsPath, 'blog')

/*
const renderers = [
	function (node) {
		if (node.tag === 'dimertitle') {
			return false
		}

		if (node.tag === 'div' && node.props.className && node.props.className.includes('alert')) {
			return '_elements/_alert'
		}

		if (
			node.tag === 'div' &&
			node.props.className &&
			node.props.className.includes('dimer-highlight')
		) {
			return '_elements/_code'
		}
	},
]*/

async function prepareEdge() {
	const edge = new Edge({ cache: false })
	edge.mount(pagesPath)

	const shiki = new ShikiRenderer(__dirname)
	shiki.loadLanguage({ id: 'edge', scopeName: 'text.html.edge', path: './languages/edge.tmLanguage.json' })
	shiki.loadLanguage({ id: 'diff', scopeName: 'source.diff', path: './languages/diff.tmLanguage.json' })
	shiki.useTheme('github-light')
	await shiki.boot()

	const renderer = new Renderer(edge)
	renderer.use(shiki.handleCodeBlocks)
	// renderer.hook((node) => {
	// 	console.log(node)
	// })

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
