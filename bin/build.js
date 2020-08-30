const { join } = require('path')
const { cwd } = require('process')

const fs = require('fs-extra')
const readdirp = require('readdirp')
const matter = require('gray-matter')
const { Edge } = require('edge.js')
const Markdown = require('@dimerapp/markdown')
const Menu = require('../menu.js')

const contentsPath = join(cwd(), 'contents')
const pagesPath = join(cwd(), 'pages')
const staticPath = join(cwd(), 'static')
const buildPath = join(cwd(), 'build')
const guidesPath = join(contentsPath, 'guides')

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

		await fs.outputFile(
			join(buildPath, entry.path.replace(/\.edge/, '.html')),
			html
		)
	}
}

/**
 * Build all pages from their markdown files.
 */
async function buildGuidePages() {
	const edge = new Edge({ cache: false })
	edge.mount(pagesPath)

	for await (const entry of readdirp(guidesPath)) {
		const source = await fs.readFile(entry.fullPath)
		const { data: frontMatter, content } = matter(source)
		const markdown = new Markdown(content, { skipToc: true })
		const { contents } = await markdown.toHTML()
		const menu = Menu.guides[frontMatter.group]

		const html = edge.render(`_guides.edge`, {
			frontMatter,
			menu,
			content: contents,
		})

		await fs.outputFile(
			join(buildPath, `${frontMatter.permalink}.html`),
			html
		)
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
	await copyStaticFiles()
})()
