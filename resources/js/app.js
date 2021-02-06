import mediumZoom from 'medium-zoom'
import '@hotwired/turbo'
import 'alpine-hotwire-turbo-adapter'
import 'alpinejs'

window.initializeSearch = function () {
  return {
    docsearchReady: false,
    mounted() {
      // this.docsearchReady = true
      // docsearch.default({
      //   container: '#docsearch',
      // })
    },
  }
}

window.zoomImage = function () {
  return {
    mounted() {
      return mediumZoom({
        background: 'rgba(0, 0, 0, 0.6)',
      }).attach(this.$refs.image)
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
            if (entry.isIntersecting && entry.intersectionRatio >= 1) {
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
        { threshold: 1.0, rootMargin: '0px', target: '.markdown-content' }
      )

      const subsections = this.$el.querySelectorAll(elementsContainer)
      subsections.forEach((subsection) => {
        observer.observe(subsection)
      })
    },
  }
}

document.addEventListener('turbo:load', () => {
  quicklink.listen({
    el: document.querySelector('#sidebar'),
  })
})
