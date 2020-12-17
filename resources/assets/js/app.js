import 'alpinejs'
import Turbolinks from 'turbolinks'

Turbolinks.start()

Turbolinks.scroll = {}

window.initializeSearch = function () {
  return {
    docsearchReady: false,
    mounted() {
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ '@docsearch/js'),
        import(/* webpackChunkName: "docsearch" */ '@docsearch/css'),
      ]).then(([docsearch]) => {
        this.docsearchReady = true
        docsearch.default({
          container: '#docsearch',
        })
      })
    },
  }
}

window.initializeCodegroups = function () {
  return {
    activeTab: 1,
    changeTab(index, element) {
      this.$refs.highlighter.style.left = `${element.offsetLeft}px`
      this.$refs.highlighter.style.width = `${element.clientWidth}px`
      this.activeTab = index
    },
    mounted() {
      this.changeTab(1, this.$refs.firstTab)
      setTimeout(() => {
        if (this.$el.classList) {
          this.$el.classList.add('ready')
        }
      })
    },
  }
}

window.initializeIntersectionObserver = function (elementsContainer, linksContainer, activeClass) {
  return {
    mounted() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
              const id = entry.target.getAttribute('id')
              const existingActive = this.$el.querySelector(`${linksContainer} .${activeClass}`)
              if (existingActive) {
                existingActive.classList.remove(activeClass)
              }

              const newLink = this.$el.querySelector(`${linksContainer} [href="#${id}"]`)
              if (newLink) {
                newLink.classList.add(activeClass)
              }
            }
          })
        },
        { threshold: 1.0, rootMargin: '0px' }
      )

      const subsections = this.$el.querySelectorAll(elementsContainer)
      subsections.forEach((subsection) => {
        observer.observe(subsection)
      })
    },
  }
}

document.addEventListener('turbolinks:render', function () {
  const sidebar = document.querySelector('.sidebar')
  let top = Turbolinks.scroll['top']
  if (top) {
    sidebar.scrollTo(0, top)
  }
})

document.addEventListener('turbolinks:click', function () {
  const sidebar = document.querySelector('.sidebar')
  Turbolinks.scroll['top'] = sidebar.scrollTop
})
