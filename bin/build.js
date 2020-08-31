const { join } = require('path')
const { cwd } = require('process')

const fs = require('fs-extra')
const readdirp = require('readdirp')
const matter = require('gray-matter')
const { Edge, GLOBALS } = require('edge.js')
const Markdown = require('@dimerapp/markdown')
const Menu = require('../menu.js')

const contentsPath = join(cwd(), 'contents')
const pagesPath = join(cwd(), 'pages')
const staticPath = join(cwd(), 'static')
const buildPath = join(cwd(), 'build')
const guidesPath = join(contentsPath, 'guides')
const markdownPagesPath = join(contentsPath, 'pages')

const renderers = [
	function (node) {
		if (node.tag === 'dimertitle') {
			return false
		}

		if (node.tag === 'div' && node.props.className && node.props.className.includes('alert')) {
			return '_elements/_alert'
		}
	},
]

function propsToAttributes(props) {
	const attributes = []
	Object.keys(props).forEach((key) => {
		const value = props[key]
		attributes.push(`${key}="${Array.isArray(value) ? value.join(' ') : value}"`)
	})
	return attributes.join(' ')
}

function getComponentFor(node) {
	let rendererComponent = null
	for (let renderer of renderers) {
		rendererComponent = renderer(node)
		if (rendererComponent !== undefined) {
			break
		}
	}

	if (rendererComponent === false) {
		return 'components/noop'
	}

	if (rendererComponent) {
		return rendererComponent
	}

	if (node.type === 'element') {
		return `components/${node.tag}`
	}

	if (node.type === 'text') {
		return `components/rawtext`
	}
}

function prepareEdge() {
	const edge = new Edge({ cache: false })
	edge.mount(pagesPath)
	Object.keys(GLOBALS).forEach((name) => {
		edge.global(name, GLOBALS[name])
	})

	const standardComponents = [
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'p',
		'a',
		'span',
		'ul',
		'li',
		'strong',
		'code',
		'div',
		'pre',
		'img',
		'em',
		'video',
		'source',
		'ol',
		'table',
		'thead',
		'tr',
		'th',
		'td',
		'tbody',
		'hr',
	]

	standardComponents.forEach((component) => {
		edge.registerTemplate(`components/${component}`, {
			template: `<${component} {{{ propsToAttributes(node.props) }}}>
      @each(child in node.children)
        @!component(getComponentFor(child), { node: child })
      @endeach
      </${component}>`,
		})
	})

	edge.registerTemplate('components/rawtext', { template: `{{ node.value }}` })
	edge.registerTemplate('components/noop', { template: '' })

	edge.global('getComponentFor', getComponentFor)
	edge.global('propsToAttributes', propsToAttributes)

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
	const edge = prepareEdge()

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
			frontMatter,
			menu,
			categories,
			content: contents,
		})

		await fs.outputFile(join(buildPath, `${frontMatter.permalink}.html`), html)
	}
}

async function buildMarkdownPages() {
	const edge = prepareEdge()

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
	await copyStaticFiles()
})()
