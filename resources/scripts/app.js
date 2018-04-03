require('./prism')
require('./edge-syntax')
const Zepto = require('zepto')

function showQuickStartModal (trigger) {
  $('html').addClass('fixed')
  $('#quick-i-modal').addClass('is-active')
}

function hideQuickStartModal () {
  $('html').removeClass('fixed')
  $('#quick-i-modal').removeClass('is-active')
}

function showMobileMenu (ham) {
  $(ham).addClass('is-active')
  $(ham).closest('.container').find('.navbar-menu').addClass('is-active')
}

function hideMobileMenu (ham) {
  $(ham).removeClass('is-active')
  $(ham).closest('.container').find('.navbar-menu').removeClass('is-active')
}

Zepto(function () {
  docsearch({
    appId: adonis.algoliaAppId,
    apiKey: adonis.algoliaApiKey,
    indexName: 'adonisjs',
    inputSelector: '#search',
    urlSync: true,
    algoliaOptions: {
      facetFilters: ['version:'+window.adonis.currentVersion || window.adonis.version]
    }
  })

  $('#show-quick-i-modal').click(function (e) {
    e.preventDefault()
    showQuickStartModal()
  })

  $(window).on('keyup', function (e) {
    if (e.which === 27) {
      hideQuickStartModal()
    }
  })

  $('.modal-background, .modal-close').click(function (e) {
    e.preventDefault()
    hideQuickStartModal()
  })

  $('html').click(function () {
    $('.has-dropdown').removeClass('is-active')
  })

  $('.has-dropdown > a').click(function (e) {
    e.preventDefault()
    e.stopPropagation()
    $(this).parent().toggleClass('is-active')
  })

  $('.navbar-burger').click(function () {
    if ($(this).hasClass('is-active')) {
      hideMobileMenu(this)
    } else {
      showMobileMenu(this)
    }
  })

  if ($('#version-switch')) {
    $('#version-switch').on('change', function () {
      const currentUrl = window.location.pathname
      const selectedVersion = $(this).val()
      window.location = currentUrl.replace(/\/docs\/\d\.\d/, `/docs/${selectedVersion}`)
    })
  }

  if ($('#docs-switch')) {
    $('#docs-switch').on('change', function () {
      const currentUrl = window.location.pathname
      const selectedDoc = $(this).val()
      window.location = selectedDoc
    })
  }
})
