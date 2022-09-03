function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  )
}

document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute("role", "button")
  summary.setAttribute("aria-expanded", "false")

  if (summary.nextElementSibling.getAttribute("id")) {
    summary.setAttribute("aria-controls", summary.nextElementSibling.id)
  }

  summary.addEventListener("click", (event) => {
    event.currentTarget.setAttribute(
      "aria-expanded",
      !event.currentTarget.closest("details").hasAttribute("open")
    )
  })

  if (summary.closest("header-drawer")) return
  summary.parentElement.addEventListener("keyup", onKeyUpEscape)
})

const trapFocusHandlers = {}

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container)
  var first = elements[0]
  var last = elements[elements.length - 1]

  removeTrapFocus()

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return

    document.addEventListener("keydown", trapFocusHandlers.keydown)
  }

  trapFocusHandlers.focusout = function () {
    document.removeEventListener("keydown", trapFocusHandlers.keydown)
  }

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== "TAB") return // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault()
      first.focus()
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault()
      last.focus()
    }
  }

  document.addEventListener("focusout", trapFocusHandlers.focusout)
  document.addEventListener("focusin", trapFocusHandlers.focusin)

  elementToFocus.focus()
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible")
} catch {
  focusVisiblePolyfill()
}

function focusVisiblePolyfill() {
  const navKeys = [
    "ARROWUP",
    "ARROWDOWN",
    "ARROWLEFT",
    "ARROWRIGHT",
    "TAB",
    "ENTER",
    "SPACE",
    "ESCAPE",
    "HOME",
    "END",
    "PAGEUP",
    "PAGEDOWN",
  ]
  let currentFocusedElement = null
  let mouseClick = null

  window.addEventListener("keydown", (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false
    }
  })

  window.addEventListener("mousedown", (event) => {
    mouseClick = true
  })

  window.addEventListener(
    "focus",
    () => {
      if (currentFocusedElement)
        currentFocusedElement.classList.remove("focused")

      if (mouseClick) return

      currentFocusedElement = document.activeElement
      currentFocusedElement.classList.add("focused")
    },
    true
  )
}

function pauseAllMedia() {
  document.querySelectorAll(".js-youtube").forEach((video) => {
    video.contentWindow.postMessage(
      '{"event":"command","func":"' + "pauseVideo" + '","args":""}',
      "*"
    )
  })
  document.querySelectorAll(".js-vimeo").forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', "*")
  })
  document.querySelectorAll("video").forEach((video) => video.pause())
  document.querySelectorAll("product-model").forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause()
  })
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener("focusin", trapFocusHandlers.focusin)
  document.removeEventListener("focusout", trapFocusHandlers.focusout)
  document.removeEventListener("keydown", trapFocusHandlers.keydown)

  if (elementToFocus) elementToFocus.focus()
}

function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== "ESCAPE") return

  const openDetailsElement = event.target.closest("details[open]")
  if (!openDetailsElement) return

  const summaryElement = openDetailsElement.querySelector("summary")
  openDetailsElement.removeAttribute("open")
  summaryElement.setAttribute("aria-expanded", false)
  summaryElement.focus()
}

class QuantityInput extends HTMLElement {
  constructor() {
    super()
    this.input = this.querySelector("input")
    this.changeEvent = new Event("change", { bubbles: true })

    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onButtonClick.bind(this))
    )
  }

  onButtonClick(event) {
    event.preventDefault()
    const previousValue = this.input.value

    event.target.name === "plus" ? this.input.stepUp() : this.input.stepDown()
    if (previousValue !== this.input.value)
      this.input.dispatchEvent(this.changeEvent)
  }
}

customElements.define("quantity-input", QuantityInput)

function debounce(fn, wait) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn.apply(this, args), wait)
  }
}

function fetchConfig(type = "json") {
  return {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/${type}`,
    },
  }
}

/*
 * Shopify Common JS
 *
 */
if (typeof window.Shopify == "undefined") {
  window.Shopify = {}
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments)
  }
}

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i]
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i
      return i
    }
  }
}

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener
    ? target.addEventListener(eventName, callback, false)
    : target.attachEvent("on" + eventName, callback)
}

Shopify.postLink = function (path, options) {
  options = options || {}
  var method = options["method"] || "post"
  var params = options["parameters"] || {}

  var form = document.createElement("form")
  form.setAttribute("method", method)
  form.setAttribute("action", path)

  for (var key in params) {
    var hiddenField = document.createElement("input")
    hiddenField.setAttribute("type", "hidden")
    hiddenField.setAttribute("name", key)
    hiddenField.setAttribute("value", params[key])
    form.appendChild(hiddenField)
  }
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}

Shopify.CountryProvinceSelector = function (
  country_domid,
  province_domid,
  options
) {
  this.countryEl = document.getElementById(country_domid)
  this.provinceEl = document.getElementById(province_domid)
  this.provinceContainer = document.getElementById(
    options["hideElement"] || province_domid
  )

  Shopify.addListener(
    this.countryEl,
    "change",
    Shopify.bind(this.countryHandler, this)
  )

  this.initCountry()
  this.initProvince()
}

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute("data-default")
    Shopify.setSelectorByValue(this.countryEl, value)
    this.countryHandler()
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute("data-default")
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value)
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex]
    var raw = opt.getAttribute("data-provinces")
    var provinces = JSON.parse(raw)

    this.clearOptions(this.provinceEl)
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = "none"
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement("option")
        opt.value = provinces[i][0]
        opt.innerHTML = provinces[i][1]
        this.provinceEl.appendChild(opt)
      }

      this.provinceContainer.style.display = ""
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild)
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement("option")
      opt.value = values[i]
      opt.innerHTML = values[i]
      selector.appendChild(opt)
    }
  },
}

class MenuDrawer extends HTMLElement {
  constructor() {
    super()

    this.mainDetailsToggle = this.querySelector("details")

    if (navigator.platform === "iPhone")
      document.documentElement.style.setProperty(
        "--viewport-height",
        `${window.innerHeight}px`
      )

    this.addEventListener("keyup", this.onKeyUp.bind(this))
    this.addEventListener("focusout", this.onFocusOut.bind(this))
    this.bindEvents()
  }

  bindEvents() {
    this.querySelectorAll("summary").forEach((summary) =>
      summary.addEventListener("click", this.onSummaryClick.bind(this))
    )
    this.querySelectorAll("button").forEach((button) =>
      button.addEventListener("click", this.onCloseButtonClick.bind(this))
    )
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== "ESCAPE") return

    const openDetailsElement = event.target.closest("details[open]")
    if (!openDetailsElement) return

    openDetailsElement === this.mainDetailsToggle
      ? this.closeMenuDrawer(
          event,
          this.mainDetailsToggle.querySelector("summary")
        )
      : this.closeSubmenu(openDetailsElement)
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget
    const detailsElement = summaryElement.parentNode
    const isOpen = detailsElement.hasAttribute("open")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    function addTrapFocus() {
      trapFocus(
        summaryElement.nextElementSibling,
        detailsElement.querySelector("button")
      )
      summaryElement.nextElementSibling.removeEventListener(
        "transitionend",
        addTrapFocus
      )
    }

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault()
      isOpen
        ? this.closeMenuDrawer(event, summaryElement)
        : this.openMenuDrawer(summaryElement)
    } else {
      setTimeout(() => {
        detailsElement.classList.add("menu-opening")
        summaryElement.setAttribute("aria-expanded", true)
        !reducedMotion || reducedMotion.matches
          ? addTrapFocus()
          : summaryElement.nextElementSibling.addEventListener(
              "transitionend",
              addTrapFocus
            )
      }, 100)
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening")
    })
    summaryElement.setAttribute("aria-expanded", true)
    trapFocus(this.mainDetailsToggle, summaryElement)
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`)
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove("menu-opening")
      this.mainDetailsToggle.querySelectorAll("details").forEach((details) => {
        details.removeAttribute("open")
        details.classList.remove("menu-opening")
      })
      document.body.classList.remove(
        `overflow-hidden-${this.dataset.breakpoint}`
      )
      removeTrapFocus(elementToFocus)
      this.closeAnimation(this.mainDetailsToggle)
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (
        this.mainDetailsToggle.hasAttribute("open") &&
        !this.mainDetailsToggle.contains(document.activeElement)
      )
        this.closeMenuDrawer()
    })
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest("details")
    this.closeSubmenu(detailsElement)
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove("menu-opening")
    detailsElement.querySelector("summary").setAttribute("aria-expanded", false)
    removeTrapFocus()
    this.closeAnimation(detailsElement)
  }

  closeAnimation(detailsElement) {
    let animationStart

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time
      }

      const elapsedTime = time - animationStart

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation)
      } else {
        detailsElement.removeAttribute("open")
        if (detailsElement.closest("details[open]")) {
          trapFocus(
            detailsElement.closest("details[open]"),
            detailsElement.querySelector("summary")
          )
        }
      }
    }

    window.requestAnimationFrame(handleAnimation)
  }
}

customElements.define("menu-drawer", MenuDrawer)

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super()
  }

  openMenuDrawer(summaryElement) {
    this.header =
      this.header || document.getElementById("shopify-section-header")
    this.borderOffset =
      this.borderOffset ||
      this.closest(".header-wrapper").classList.contains(
        "header-wrapper--border-bottom"
      )
        ? 1
        : 0
    document.documentElement.style.setProperty(
      "--header-bottom-position",
      `${parseInt(
        this.header.getBoundingClientRect().bottom - this.borderOffset
      )}px`
    )

    setTimeout(() => {
      this.mainDetailsToggle.classList.add("menu-opening")
    })

    summaryElement.setAttribute("aria-expanded", true)
    trapFocus(this.mainDetailsToggle, summaryElement)
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`)
  }
}

customElements.define("header-drawer", HeaderDrawer)

class ModalDialog extends HTMLElement {
  constructor() {
    super()
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      "click",
      this.hide.bind(this)
    )
    this.addEventListener("keyup", (event) => {
      if (event.code.toUpperCase() === "ESCAPE") this.hide()
    })
    if (this.classList.contains("media-modal")) {
      this.addEventListener("pointerup", (event) => {
        if (
          event.pointerType === "mouse" &&
          !event.target.closest("deferred-media, product-model")
        )
          this.hide()
      })
    } else {
      this.addEventListener("click", (event) => {
        if (event.target.nodeName === "MODAL-DIALOG") this.hide()
      })
    }
  }

  show(opener) {
    this.openedBy = opener
    const popup = this.querySelector(".template-popup")
    document.body.classList.add("overflow-hidden")
    this.setAttribute("open", "")
    if (popup) popup.loadContent()
    trapFocus(this, this.querySelector('[role="dialog"]'))
    window.pauseAllMedia()
  }

  hide() {
    document.body.classList.remove("overflow-hidden")
    this.removeAttribute("open")
    removeTrapFocus(this.openedBy)
    window.pauseAllMedia()
  }
}
customElements.define("modal-dialog", ModalDialog)

class ModalOpener extends HTMLElement {
  constructor() {
    super()

    const button = this.querySelector("button")

    if (!button) return
    button.addEventListener("click", () => {
      const modal = document.querySelector(this.getAttribute("data-modal"))
      if (modal) modal.show(button)
    })
  }
}
customElements.define("modal-opener", ModalOpener)

class DeferredMedia extends HTMLElement {
  constructor() {
    super()
    const poster = this.querySelector('[id^="Deferred-Poster-"]')
    if (!poster) return
    poster.addEventListener("click", this.loadContent.bind(this))
  }

  loadContent() {
    window.pauseAllMedia()
    if (!this.getAttribute("loaded")) {
      const content = document.createElement("div")
      content.appendChild(
        this.querySelector("template").content.firstElementChild.cloneNode(true)
      )

      this.setAttribute("loaded", true)
      this.appendChild(
        content.querySelector("video, model-viewer, iframe")
      ).focus()
    }
  }
}

customElements.define("deferred-media", DeferredMedia)

class SliderComponent extends HTMLElement {
  constructor() {
    super()
    this.slider = this.querySelector("ul")
    this.sliderItems = this.querySelectorAll("li")
    this.pageCount = this.querySelector(".slider-counter--current")
    this.pageTotal = this.querySelector(".slider-counter--total")
    this.prevButton = this.querySelector('button[name="previous"]')
    this.nextButton = this.querySelector('button[name="next"]')

    if (!this.slider || !this.nextButton) return

    const resizeObserver = new ResizeObserver((entries) => this.initPages())
    resizeObserver.observe(this.slider)

    this.slider.addEventListener("scroll", this.update.bind(this))
    this.prevButton.addEventListener("click", this.onButtonClick.bind(this))
    this.nextButton.addEventListener("click", this.onButtonClick.bind(this))
  }

  initPages() {
    const sliderItemsToShow = Array.from(this.sliderItems).filter(
      (element) => element.clientWidth > 0
    )
    this.sliderLastItem = sliderItemsToShow[sliderItemsToShow.length - 1]
    if (sliderItemsToShow.length === 0) return
    this.slidesPerPage = Math.floor(
      this.slider.clientWidth / sliderItemsToShow[0].clientWidth
    )
    this.totalPages = sliderItemsToShow.length - this.slidesPerPage + 1
    this.update()
  }

  update() {
    if (!this.pageCount || !this.pageTotal) return
    this.currentPage =
      Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) + 1

    if (this.currentPage === 1) {
      this.prevButton.setAttribute("disabled", "disabled")
    } else {
      this.prevButton.removeAttribute("disabled")
    }

    if (this.currentPage === this.totalPages) {
      this.nextButton.setAttribute("disabled", "disabled")
    } else {
      this.nextButton.removeAttribute("disabled")
    }

    this.pageCount.textContent = this.currentPage
    this.pageTotal.textContent = this.totalPages
  }

  onButtonClick(event) {
    event.preventDefault()
    const slideScrollPosition =
      event.currentTarget.name === "next"
        ? this.slider.scrollLeft + this.sliderLastItem.clientWidth
        : this.slider.scrollLeft - this.sliderLastItem.clientWidth
    this.slider.scrollTo({
      left: slideScrollPosition,
    })
  }
}

customElements.define("slider-component", SliderComponent)

class VariantSelects extends HTMLElement {
  constructor() {
    super()
    this.addEventListener("change", this.onVariantChange)
  }

  onVariantChange() {
    this.updateOptions()
    this.updateMasterId()
    this.toggleAddButton(true, "", false)
    this.updatePickupAvailability()
    this.removeErrorMessage()

    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true)
      this.setUnavailable()
    } else {
      this.updateMedia()
      this.updateURL()
      this.updateVariantInput()
      this.renderProductInfo()
      this.updateShareUrl()
    }
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll("select"),
      (select) => select.value
    )
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option
        })
        .includes(false)
    })
  }

  updateMedia() {
    if (!this.currentVariant) return
    if (!this.currentVariant.featured_media) return
    const newMedia = document.querySelector(
      `[data-media-id="${this.dataset.section}-${this.currentVariant.featured_media.id}"]`
    )

    if (!newMedia) return
    const modalContent = document.querySelector(
      `#ProductModal-${this.dataset.section} .product-media-modal__content`
    )
    const newMediaModal = modalContent.querySelector(
      `[data-media-id="${this.currentVariant.featured_media.id}"]`
    )
    const parent = newMedia.parentElement
    if (parent.firstChild == newMedia) return
    modalContent.prepend(newMediaModal)
    parent.prepend(newMedia)
    this.stickyHeader =
      this.stickyHeader || document.querySelector("sticky-header")
    if (this.stickyHeader) {
      this.stickyHeader.dispatchEvent(new Event("preventHeaderReveal"))
    }
    window.setTimeout(() => {
      parent.scrollLeft = 0
      parent
        .querySelector("li.product__media-item")
        .scrollIntoView({ behavior: "smooth" })
    })
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === "false") return
    window.history.replaceState(
      {},
      "",
      `${this.dataset.url}?variant=${this.currentVariant.id}`
    )
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`)
    if (!shareButton) return
    shareButton.updateUrl(
      `${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`
    )
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(
      `#product-form-${this.dataset.section}, #product-form-installment`
    )
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]')
      input.value = this.currentVariant.id
      input.dispatchEvent(new Event("change", { bubbles: true }))
    })
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector("pickup-availability")
    if (!pickUpAvailability) return

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id)
    } else {
      pickUpAvailability.removeAttribute("available")
      pickUpAvailability.innerHTML = ""
    }
  }

  removeErrorMessage() {
    const section = this.closest("section")
    if (!section) return

    const productForm = section.querySelector("product-form")
    if (productForm) productForm.handleErrorMessage()
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`
        const html = new DOMParser().parseFromString(responseText, "text/html")
        const destination = document.getElementById(id)
        const source = html.getElementById(id)

        if (source && destination) destination.innerHTML = source.innerHTML

        const price = document.getElementById(`price-${this.dataset.section}`)

        if (price) price.classList.remove("visibility-hidden")
        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        )
      })
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    if (!productForm) return
    const addButton = productForm.querySelector('[name="add"]')
    const addButtonText = productForm.querySelector('[name="add"] > span')

    if (!addButton) return

    if (disable) {
      addButton.setAttribute("disabled", "disabled")
      if (text) addButtonText.textContent = text
    } else {
      addButton.removeAttribute("disabled")
      addButtonText.textContent = window.variantStrings.addToCart
    }

    if (!modifyClass) return
  }

  setUnavailable() {
    const button = document.getElementById(
      `product-form-${this.dataset.section}`
    )
    const addButton = button.querySelector('[name="add"]')
    const addButtonText = button.querySelector('[name="add"] > span')
    const price = document.getElementById(`price-${this.dataset.section}`)
    if (!addButton) return
    addButtonText.textContent = window.variantStrings.unavailable
    if (price) price.classList.add("visibility-hidden")
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent)
    return this.variantData
  }
}

customElements.define("variant-selects", VariantSelects)

class VariantRadios extends VariantSelects {
  constructor() {
    super()
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll("fieldset"))
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value
    })
  }
}

customElements.define("variant-radios", VariantRadios)

// SATURO CUSTOM JS

function removeImageLoadingAnimation(image) {
  // Remove loading animation
  var imageWrapper = image.hasAttribute("data-image-loading-animation")
    ? image
    : image.closest("[data-image-loading-animation]")

  if (imageWrapper) {
    imageWrapper.removeAttribute("data-image-loading-animation")
  }
}

// Sovendus Cookie setting
function writeCookie(key, value, days) {
  var date = new Date()
  days = days || 365

  date.setTime(+date + days * 86400000) //24 * 60 * 60 * 1000
  window.document.cookie =
    key + "=" + value + "; expires=" + date.toGMTString() + "; path=/"

  return value
}

document.addEventListener("DOMContentLoaded", function () {
  const tabletWidth = 1024
  const menuOpenClass = "menu-opened"

  function toggleMegaMenu(name) {
    const $megaMenuActive = document.querySelector("[data-mega-menu-active]")

    function addOpenClasses() {
      document.body.classList.add(menuOpenClass)
    }
    function removeOpenClasses() {
      document.body.classList.remove(menuOpenClass)
    }

    if ($megaMenuActive && name) {
      const megaMenuActiveData = $megaMenuActive.dataset.megaMenuActive

      function makeMenuItemsVisible() {
        const menuItems = document.querySelectorAll(`[data-menu-item]`)
        if (menuItems.length > 0) {
          menuItems.forEach(function (menuItem) {
            menuItem.style.display = "none"
          })
        }
        const activeItem = document.querySelector(`[data-menu-item=${name}]`)
        if (activeItem) {
          $megaMenuActive.dataset.megaMenuActive = name
          activeItem.style.display = "flex"
        }

        const $buttons = document.querySelectorAll(
          `[data-mega-menu-expand]:not([data-mega-menu-expand="${name}"]`
        )
        if ($buttons.length > 0) {
          $buttons.forEach(function (button) {
            button.classList.remove("active")
          })
        }
        const $activeButton = document.querySelector(
          `[data-mega-menu-expand=${name}]`
        )
        if ($activeButton && $activeButton.classList.contains("active")) {
          $activeButton.classList.remove("active")
          $megaMenuActive.dataset.megaMenuCollapsed = "true"
        } else {
          $activeButton.classList.add("active")
          $megaMenuActive.dataset.megaMenuCollapsed = ""
        }
      }

      if (megaMenuActiveData.length <= 0) {
        addOpenClasses()
        makeMenuItemsVisible()
      }
      if (megaMenuActiveData.length > 0 && megaMenuActiveData !== name) {
        makeMenuItemsVisible()
      }
      if (megaMenuActiveData.length > 0 && megaMenuActiveData === name) {
        removeOpenClasses()
        $megaMenuActive.dataset.megaMenuActive = ""
      }
    }
    if (!name) {
      removeOpenClasses()
      $megaMenuActive.dataset.megaMenuActive = ""
    }
  }

  const $inlineMenuLink = document.querySelectorAll("[data-inline-menu-link]")
  $inlineMenuLink.forEach(function (element) {
    element.addEventListener("click", function (event) {
      const name = element.dataset.inlineMenuLink
      if (window.innerWidth <= tabletWidth) {
        if (name) {
          const headerSticky = document.querySelector(
            ".shopify-section-header-sticky"
          )
          if (!headerSticky) {
            window.scrollTo({
              top: 0,
              behavior: "smooth",
            })
          }
          event.preventDefault()
          toggleMegaMenu(name)
        }
      }
    })

    element.addEventListener("mouseover", function () {
      const name = element.dataset.inlineMenuLink
      if (window.innerWidth > tabletWidth) {
        toggleMegaMenu(name)
      }
    })

    element.addEventListener("mouseleave", function () {
      const name = element.dataset.inlineMenuLink
      if (window.innerWidth > tabletWidth) {
        if (!document.querySelector(".mega-menu:hover")) {
          toggleMegaMenu(name)
        }
      }
    })
  })

  const $megaMenuBurger = document.querySelector("[data-mega-menu-burger]")
  if ($megaMenuBurger) {
    const $megaMenuActive = document.querySelector("[data-mega-menu-active]")
    const name = $megaMenuBurger.dataset.megaMenuBurger
    $megaMenuBurger.addEventListener("click", function () {
      const menuOpened = document.body.classList.contains("menu-opened")

      if (!menuOpened) {
        if ($megaMenuActive) {
          if ($megaMenuActive.dataset.megaMenuCollapsed) {
            toggleMegaMenu()
            $megaMenuActive.dataset.megaMenuCollapsed = ""
          } else {
            toggleMegaMenu(name)
          }
        }
      } else {
        toggleMegaMenu()
        $megaMenuActive.dataset.megaMenuCollapsed = ""
      }
    })
  }

  const $megaMenu = document.querySelector("[data-mega-menu]")
  if ($megaMenu) {
    $megaMenu.addEventListener("mouseleave", function () {
      if (window.innerWidth > tabletWidth) {
        if (!document.querySelector("[data-inline-menu-link]:hover")) {
          toggleMegaMenu()
        }
      }
    })
  }

  const $megaMenuExpand = document.querySelectorAll("[data-mega-menu-expand]")
  $megaMenuExpand.forEach(function (element) {
    element.addEventListener("click", function () {
      const name = element.dataset.megaMenuExpand
      const $megaMenuActive = document.querySelector("[data-mega-menu-active]")
      const menuItems = document.querySelectorAll(`[data-menu-item]`)
      if (menuItems.length > 0 && $megaMenuActive) {
        menuItems.forEach(function (menuItem) {
          menuItem.style.display = "none"
        })
      }
      const activeItem = document.querySelector(`[data-menu-item=${name}]`)
      if (
        activeItem &&
        $megaMenuActive &&
        $megaMenuActive.dataset.megaMenuActive !== name
      ) {
        $megaMenuActive.dataset.megaMenuActive = name
        activeItem.style.display = "flex"
      } else {
        $megaMenuActive.dataset.megaMenuActive = ""
        activeItem.style.display = "none"
      }

      const $buttons = document.querySelectorAll(
        `[data-mega-menu-expand]:not([data-mega-menu-expand="${name}"]`
      )
      if ($buttons.length > 0) {
        $buttons.forEach(function (button) {
          button.classList.remove("active")
        })
      }
      const $activeButton = document.querySelector(
        `[data-mega-menu-expand=${name}]`
      )
      if ($activeButton && $activeButton.classList.contains("active")) {
        $activeButton.classList.remove("active")
        $megaMenuActive.dataset.megaMenuCollapsed = "true"
      } else {
        $activeButton.classList.add("active")
        $megaMenuActive.dataset.megaMenuCollapsed = ""
      }
    })
  })

  const url_string = window.location.href
  const url = new URL(url_string)
  let sovReqToken =
    url.searchParams.get("sovreqtoken") || url.searchParams.get("sovReqToken")
  let sovProductID = url.searchParams.get("productid")

  if (sovReqToken) {
    writeCookie("sovReqToken", sovReqToken, 1)
  }

  if (sovProductID) {
    writeCookie("sovProductID", sovProductID, 1)
  }

  // info Popup for subscription on product page
  const infoPopupHtml = `
	<div class="info-popup__bg" data-close-info-popup></div>
	<div class="info-popup__body">
	  <button class="info-popup__close" type="button" data-close-info-popup>
		+
	  </button>
	  <div class="info-popup__content">
		<h2 class="info-popup__title">SO EINFACH GEHT’S</h2>
		<div class="info-popup__items">
			<div class="info-popup__item">
				<div class="info-popup__item__number">1</div>
				<h3 class="info-popup__item_text">Suche dir dein Produkt aus</h3>
			</div>
			<div class="info-popup__item">
				<div class="info-popup__item__number">2</div>
				<h3 class="info-popup__item_text">Wähle dein gewünschtes Lieferintervall</h3>
			</div>
			<div class="info-popup__item">
				<div class="info-popup__item__number">3</div>
				<h3 class="info-popup__item_text">Wir liefern dir dein SATURO automatisch</h3>
			</div>
		</div>
		<p class="info-popup__footer">Du kannst Lieferintervall, Lieferadresse und Zahlungsmittel jederzeit ändern. Es entstehen keine Gebühren für dich. Du kannst dein Abonnement jederzeit kostenlos kündigen.</p>
		</div>
	</div>
	`

  const infoPopupDiv = document.createElement("div")
  infoPopupDiv.classList.add("info-popup")
  infoPopupDiv.dataset.infoPopup = ""
  infoPopupDiv.innerHTML = infoPopupHtml
  // document.body.appendChild(infoPopupDiv);

  document.querySelectorAll("[data-close-info-popup]").forEach((item) => {
    item.addEventListener("click", function () {
      document.body.classList.remove("info-popup--show")
    })
  })

  document.querySelectorAll("[data-show-info-popup]").forEach((item) => {
    item.addEventListener("click", function () {
      document.body.classList.add("info-popup--show")
      const $closeInfo = document.querySelector(
        ".info-popup__body [data-close-info-popup]"
      )
      if ($closeInfo) {
        $closeInfo.focus()
      }
    })
  })

  // Product page - Sold Out button

  const $fixedAddToCart = $("[data-product-fixed-button-container]")
  const $cartSubmitBtn = $("a.btn.product-form__cart-submit")
  const iconSpinner = `<svg aria-hidden="true" focusable="false" role="presentation" class="icon icon-spinner" viewBox="0 0 20 20"><path d="M7.229 1.173a9.25 9.25 0 1 0 11.655 11.412 1.25 1.25 0 1 0-2.4-.698 6.75 6.75 0 1 1-8.506-8.329 1.25 1.25 0 1 0-.75-2.385z" fill="#919EAB"/></svg>`
  if ($cartSubmitBtn) {
    $cartSubmitBtn.html(
      `<span class="product-form__cart-submit__text" data-btn-text>In den Warenkorb</span><span class="hide product-form__cart-submit__loader" data-loader>${iconSpinner}</span>`
    )
  }

  function setButtonAvailability() {
    const productId = parseInt(
      $("form[data-productid]").attr("data-productid"),
      10
    )
    const val = $(
      ".product-form__variant-selector select.pf-variant-select option:selected"
    ).val()
    const filteredVariants = __pageflyProducts[productId].variants.filter(
      (item) => item.title === val
    )

    const $productFormShipping = $("[data-product-form-shipping]")

    // Temporary solution to show Chocolate recommendation button
    const chocolateItemId = 32879054258313

    if (
      filteredVariants.length > 0 &&
      $cartSubmitBtn.length > 0 &&
      $fixedAddToCart.length > 0 &&
      $productFormShipping.length > 0
    ) {
      if (filteredVariants[0].available) {
        $cartSubmitBtn.attr("disabled", false)
        $fixedAddToCart.removeClass("disabled")
        $productFormShipping.removeClass("hide")

        // Temporary solution to show Chocolate recommendation button
        $('[data-sold-out-alt="' + chocolateItemId + '"]').addClass("hide")
      } else {
        $cartSubmitBtn.text("Ausverkauft")
        $cartSubmitBtn.attr("disabled", true)
        $fixedAddToCart.addClass("disabled")
        $productFormShipping.addClass("hide")

        // Temporary solution to show Chocolate recommendation button
        if (filteredVariants[0].id === chocolateItemId) {
          $('[data-sold-out-alt="' + chocolateItemId + '"]').removeClass("hide")
        }
      }
    }
  }

  if (document.body.classList.contains("template-product")) {
    $(document).on(
      "change",
      ".product-form__variant-selector select.pf-variant-select",
      function () {
        setButtonAvailability()
        changeVariantImage()
      }
    )

    let time = 0
    const checkExist = setInterval(function () {
      time += 1
      if (time === 3500) {
        clearInterval(checkExist)
      }
      if (
        $(".product-form__variant-selector select.pf-variant-select").length
      ) {
        setTimeout(setButtonAvailability, 2000)
        clearInterval(checkExist)
      }
    })
  }

  const $productFormCartSubmit = $(".product-form__cart-submit")
  const $productForm = $(".product-form")

  if (
    document.body.classList.contains("template-product") &&
    $productFormCartSubmit.length > 0 &&
    $fixedAddToCart.length > 0
  ) {
    const setFixedAddToCartOnScroll = function () {
      const fixedAreaPosition =
        $productFormCartSubmit.offset().top +
        $productFormCartSubmit.outerHeight()
      const scrollPosition = $(window).scrollTop()
      if (scrollPosition > fixedAreaPosition) {
        $fixedAddToCart.removeClass("hidden")
      } else {
        $fixedAddToCart.addClass("hidden")
      }
    }

    $(window).on("scroll", setFixedAddToCartOnScroll)
  }

  function toggleButtonLoader(that) {
    $(that).find("[data-btn-text]").toggleClass("hidden")
    $(that).find("[data-loader]").toggleClass("hidden")

    $("[data-fixed-product-btn-text]").toggleClass("hidden")
    $("[data-fixed-product-btn-loader]").toggleClass("hidden")
  }

  if (typeof saturo != 'undefined') {
    saturo.toggleButtonLoader = toggleButtonLoader
  }

  if ($productFormCartSubmit.length > 0 || $productForm.length > 0) {
    function addToCart(data, that) {
      jQuery.ajax({
        type: "POST",
        url: "/cart/add.js",
        data: data,
        dataType: "json",
        error: () => {
          if (typeof that != "object") {
            setTimeout(() => {
              toggleButtonLoader(that)
            }, 1000)
          }
        },
        success: (response) => {
          const isVariantBtn = $(that).siblings("[data-variant-qty]").length > 0

          if (!isVariantBtn) {
            setTimeout(() => {
              toggleButtonLoader(that)
            }, 1000)
          }
          if ($(that).hasClass("product__variant-button")) {
            $(that).closest("[data-variant-wrapper]").addClass("has-quantity")
            if (isVariantBtn) {
              const $qtyInput = $(that)
                .siblings("[data-variant-qty]")
                .find("[data-variant-qty-input]")
              $qtyInput.val(
                parseInt(
                  $(that)
                    .siblings("[data-variant-qty]")
                    .find("[data-variant-qty-input]")
                    .val(),
                  10
                ) + 1
              )
            }
          }
          if ($(that).hasClass("qty-variant__plus")) {
            const $qtyInput = $(that).siblings("[data-variant-qty-input]")
            $qtyInput.val(parseInt($qtyInput.val(), 10) + 1)
          }

          const showDrawer =
            that && typeof $(that).data("variant-btn") === "undefined"
          if (
            typeof upside === "object" &&
            upside &&
            typeof upside.ucd === "object" &&
            upside.ucd.isActive()
          ) {
            upside.ucd.helpers.ajaxCart.load(showDrawer)
          }
        },
      })
    }

    function setLoadAddToCart(that, variantId, loader) {
      const sellingPlanNum = parseInt($("[data-selling-plan-group]").val(), 10)
      if (loader) {
        toggleButtonLoader(that)
      }

      const qty = $(".product-form__input--quantity input").val()
      const $productFormSubVariantOption = $(
        "#product-form__subscription-variant--hidden option:first-child"
      )
      if (!variantId && $productFormSubVariantOption.length > 0) {
        variantId = parseInt($productFormSubVariantOption.attr("data-id"), 10)
      }
      const $inputSubscribe = $(
        "input#product-form__order-type-selector--subscribe"
      )
      const $inputOneTime = $(
        "input#product-form__order-type-selector--onetime"
      )
      let subscriptionVariantId = []

      if ($inputSubscribe.is(":checked")) {
        $("select#product-form__subscription-variant--hidden option").each(
          function () {
            if ($(that).data("id") == variantId) {
              subscriptionVariantId = $(that).text()
              return false
            }
          }
        )

        let data = {
          id: variantId,
          quantity: qty,
          selling_plan: sellingPlanNum,
        }
        addToCart(data, that)
      }

      if ($inputSubscribe.length === 0 || $inputOneTime.is(":checked")) {
        let data = {
          id: variantId,
          quantity: qty,
        }
        addToCart(data, that)
      }
    }

    $("a.product-form__cart-submit, [data-variant-btn]").click(function () {
      const maxQuantity = parseInt($(this).attr("data-max-quantity"), 10)
      const dataProductId = $("form[data-productid]").attr("data-productid")
      let loader = true
      let variantId = $("input.pf-variant-label").val()

      if (maxQuantity && dataProductId) {
        jQuery.ajax({
          type: "GET",
          url: "/cart.js",
          dataType: "json",
          success: (resp) => {
            const productArr = resp.items.filter(
              (item) => item.product_id === parseInt(dataProductId, 10)
            )

            if (
              productArr.length > 0 &&
              productArr[0].quantity >= maxQuantity
            ) {
              upside.ucd.helpers.ajaxCart.show()
            } else {
              if (
                typeof $("[data-variant-btn]").attr("data-variant-btn") ===
                "string"
              ) {
                variantId = $(this)
                  .closest("[data-variant-id]")
                  .attr("data-variant-id")
                loader = false
              }

              setLoadAddToCart(this, variantId, loader)
            }
          },
        })
      } else {
        if (
          typeof $("[data-variant-btn]").attr("data-variant-btn") === "string"
        ) {
          variantId = $(this)
            .closest("[data-variant-id]")
            .attr("data-variant-id")
          loader = false
        }

        setLoadAddToCart(this, variantId, loader)
      }
    })

    $(".product__variant__plus").on("click", function () {
      $(this).siblings("[data-qty]").find("[data-qty-plus]").click()
    })

    $("[data-variant-qty-minus], [data-variant-qty-plus]").on(
      "click",
      function () {
        const isPlus =
          typeof $(this).attr("data-variant-qty-plus") === "string"
            ? true
            : false
        const variantId = $(this)
          .closest("[data-variant-id]")
          .attr("data-variant-id")
        const $qtyInput = $(this).siblings("[data-variant-qty-input]")
        const that = this

        function changeCart(quantity) {
          jQuery.ajax({
            type: "POST",
            url: "/cart/change.js",
            dataType: "json",
            data: {
              id: variantId,
              quantity,
            },
            success: function (resp) {
              if (quantity === 0) {
                $(that)
                  .closest("[data-variant-wrapper]")
                  .removeClass("has-quantity")
              }
              $qtyInput.val(quantity)

              const cartCount = parseInt(
                $("#ucd-checkout-form[data-items]").text(),
                10
              )
              if (isPlus) {
                $("#ucd-checkout-form[data-items]").text(cartCount + 1)
              } else if (!isPlus) {
                $("#ucd-checkout-form[data-items]").text(cartCount - 1)
              }
            },
          })
        }

        if (isPlus) {
          changeCart(parseInt($qtyInput.val(), 10) + 1)
        } else if (!isPlus) {
          changeCart(parseInt($qtyInput.val(), 10) - 1)
        }
      }
    )

    $(
      ".pgfly-product-form-class .product-form__order-type .product-form__order-type-selector input[type=radio][name=option], .pgfly-product-form-class .product__subscription-option__input[type=radio][name=option]"
    ).change(function () {
      if ($("[data-mode]").length > 0) {
        $("[data-mode]").attr("data-mode", this.value)
      }

      const $pricePerMeal = $("[data-price-per-meal]")

      if (this.value == "subscription") {
        var discountedPrice = $("[data-price-actual]").attr(
          "data-discounted-price"
        )
        var discountedPriceFloat = parseFloat(
          $("[data-price-actual]")
            .data("discounted-price")
            .substr(1)
            .replace(",", ".")
        )
        var servingSize = $("input#product-form__product-details-meta").data(
          "serving-size"
        )
        var amountComparison =
          $("input#product-form__product-details-meta").data(
            "shipping-unit-servings"
          ) * $("input#product-form__product-details-meta").data("serving-size")
        var currencySymbol = discountedPrice.substr(0, 1)
        var comparisonPrice = ((discountedPriceFloat / amountComparison) * 100)
          .toFixed(2)
          .replace(".", ",")
        var servingSizePrice = (
          (discountedPriceFloat / amountComparison) *
          servingSize
        )
          .toFixed(2)
          .replace(".", ",")

        $(".product-form__order-type--subscription").css("display", "flex")
        $(".product-form__order-type--normal").css("display", "none")
        $("[data-price-before]").show()

        $("[data-price-actual]").text(discountedPrice)
        $("span.product-form__comparison-price").text(
          currencySymbol + comparisonPrice
        )
        $("span.product-form__product-price-serving").text(
          currencySymbol + servingSizePrice
        )

        if ($pricePerMeal.length > 0) {
          const price = $pricePerMeal.attr("data-price-per-meal-discount")
          $pricePerMeal.text(price)
        }
      } else if (this.value == "onetime") {
        var normalPrice = $("[data-price-before]").text()
        var normalPriceFloat = parseFloat(
          $("[data-price-before]").text().substr(1).replace(",", ".")
        )
        var servingSize = $("input#product-form__product-details-meta").data(
          "serving-size"
        )
        var amountComparison =
          $("input#product-form__product-details-meta").data(
            "shipping-unit-servings"
          ) * $("input#product-form__product-details-meta").data("serving-size")
        var currencySymbol = normalPrice.substr(0, 1)
        var comparisonPrice = ((normalPriceFloat / amountComparison) * 100)
          .toFixed(2)
          .replace(".", ",")
        var servingSizePrice = (
          (normalPriceFloat / amountComparison) *
          servingSize
        )
          .toFixed(2)
          .replace(".", ",")

        $(".product-form__order-type--subscription").css("display", "none")
        $(".product-form__order-type--normal").css("display", "grid")
        $("[data-price-before]").hide()
        $("[data-price-actual]").text(normalPrice)
        $("span.product-form__comparison-price").text(
          currencySymbol + comparisonPrice
        )
        $("span.product-form__product-price-serving").text(
          currencySymbol + servingSizePrice
        )

        if ($pricePerMeal.length > 0) {
          const price = $pricePerMeal.attr("data-price-per-meal")
          $pricePerMeal.text(price)
        }
      }
    })

    function setPriceTextQuantity() {
      const $priceActual = $("[data-price-actual]")
      const $priceBefore = $("[data-price-before]")
      const $priceTextQty = $("[data-price-text-qty]")
      const $shippingUnitServings = $("[data-shipping-unit-servings]")
      let totalQty = 0
      $("[data-qty] input").each(function () {
        totalQty = totalQty + parseInt($(this).val(), 10)
      })

      if ($priceTextQty.length > 0 && $shippingUnitServings.length > 0) {
        const shippingUnitServingsInt = parseInt(
          $shippingUnitServings.attr("data-shipping-unit-servings")
        )

        $priceTextQty.text(shippingUnitServingsInt * totalQty)
      }

      if (totalQty === 0) {
        $("[data-powder-add-to-cart]").attr("disabled", true)
        // Also disables the Personalized Quiz page add to cart button
        $("[data-quiz-variants-add-to-cart]").attr("disabled", true)
      } else {
        $("[data-powder-add-to-cart]").attr("disabled", false)
        // Also disables the Personalized Quiz page add to cart button
        $("[data-quiz-variants-add-to-cart]").attr("disabled", false)
      }

      if ($priceActual.length > 0 && $priceBefore.length > 0) {
        const normalPrice = $priceBefore.attr("data-price-before")
        const normalPriceFloat = parseFloat(
          normalPrice.substr(1).replace(",", ".")
        )
        const discountedPrice = $priceActual.attr("data-price-actual")
        const discountedPriceFloat = parseFloat(
          discountedPrice.substr(1).replace(",", ".")
        )
        const currencySymbol = normalPrice.substr(0, 1)

        const normalPriceToShow = (normalPriceFloat * totalQty)
          .toFixed(2)
          .replace(".", ",")
        $("[data-price-before]").text(currencySymbol + normalPriceToShow)

        const discountedPriceToShow = (discountedPriceFloat * totalQty)
          .toFixed(2)
          .replace(".", ",")

        if ($("[data-mode]").attr("data-mode") === "subscription") {
          $("[data-price-actual]").text(currencySymbol + discountedPriceToShow)
          $("[data-price-actual]").attr(
            "data-discounted-price",
            currencySymbol + discountedPriceToShow
          )
        } else {
          $("[data-price-actual]").text(currencySymbol + normalPriceToShow)
          $("[data-price-actual]").attr(
            "data-discounted-price",
            currencySymbol + discountedPriceToShow
          )
        }
      } else if ($priceActual.length > 0) {
        const price = $priceActual.attr("data-price-actual")
        const priceFloat = parseFloat(price.substr(1).replace(",", "."))

        const currencySymbol = price.substr(0, 1)

        const priceToShow = (priceFloat * totalQty).toFixed(2).replace(".", ",")
        $("[data-price-actual]").text(currencySymbol + priceToShow)
      }
    }

    setPriceTextQuantity()

    $("[data-qty] [data-qty-minus]").on("click", function () {
      const input = $(this).siblings("[data-qty-input]")
      const val = parseInt(input.val(), 10)
      if (val > 0) {
        const setVal = val - 1
        input.val(setVal)

        const $variantWrapper = $(this).closest("[data-variant-wrapper]")
        if ($variantWrapper.length > 0 && setVal === 0) {
          $variantWrapper.removeClass("has-quantity")
        }
      }

      setPriceTextQuantity()
    })

    $("[data-qty] [data-qty-plus]").on("click", function () {
      const input = $(this).siblings("[data-qty-input]")
      const val = parseInt(input.val(), 10)
      input.val(val + 1)

      const $variantWrapper = $(this).closest("[data-variant-wrapper]")
      if (
        $variantWrapper.length > 0 &&
        !$variantWrapper.hasClass("has-quantity")
      ) {
        $variantWrapper.addClass("has-quantity")
      }

      setPriceTextQuantity()
    })

    $('[data-powder-add-to-cart]').on('click', function() {
      const quantityInputs = $("[data-qty-input]")
      const $inputSubscribe = $(
        "input#product-form__order-type-selector--subscribe"
      )
      let data = { items: [] }
      let sellingPlanNum = null

      if ($inputSubscribe.is(":checked")) {
        sellingPlanNum = $(
          "select#product-form__subscription-frequency option:selected"
        ).val()
      }

      quantityInputs.each(function () {
        const id = $(this).closest("[data-variant-id]").attr("data-variant-id")
        const qty = $(this).val()

        if (qty > 0) {
          let dataObj = {
            id: id,
            quantity: qty,
          }

          if (sellingPlanNum) {
            dataObj["selling_plan"] = sellingPlanNum
          }

          if (
            $("[data-quiz-uid]").length > 0 &&
            $("[data-quiz-uid]").attr("data-quiz-uid")
          ) {
            dataObj = {
              ...dataObj,
              properties: {
                uid: $("[data-quiz-uid]").attr("data-quiz-uid"),
              },
            }
            
            if (typeof saturo != 'undefined') {
              saturo.writeDataToFirebase(
                { label: labelStaticTranslations },
                $("[data-quiz-uid]").attr("data-quiz-uid")
              )
            }

            var _learnq = window._learnq || []
            _learnq.push([
              "track",
              "Personalized Quiz Added to Cart 2",
              {
                added_to_cart_2: "1",
                uid: $("[data-quiz-uid]").attr("data-quiz-uid"),
              },
            ])
          }

          data.items.push(dataObj)
        }
      });

      toggleButtonLoader(this);
      addToCart(data, this);
    });


    function addQuizVariantsToCart() {
      const quantityInputs = $("[data-qty-input]")
      
      let data = { items: [] }

      quantityInputs.each(function () {
        const id = $(this).closest("[data-variant-id]").attr("data-variant-id")
        const qty = $(this).val()

        if (qty > 0) {
          let dataObj = {
            id: id,
            quantity: qty,
          }

          if (
            $("[data-quiz-uid]").length > 0 &&
            $("[data-quiz-uid]").attr("data-quiz-uid")
          ) {
            dataObj = {
              ...dataObj,
              properties: {
                uid: $("[data-quiz-uid]").attr("data-quiz-uid"),
              },
            }

            var _learnq = window._learnq || []
            _learnq.push([
              "track",
              "Personalized Quiz Added to Cart 2",
              {
                added_to_cart_2: "1",
                uid: $("[data-quiz-uid]").attr("data-quiz-uid"),
              },
            ])
            
            if (typeof dataLayer === "object") {
              dataLayer.push({
                event: "view_personal_add_to_cart",
                gtm: {
                  quiz_name: "personalized",
                },
              })
            }
          }

          data.items.push(dataObj)
        }
      });
      addToCart(data, $("[data-quiz-variants-add-to-cart]"));
    }

    if (typeof saturo != 'undefined') {
      saturo.addQuizVariantsToCart = addQuizVariantsToCart
    }
  }

  const $productFreeShippingTotalAmount = document.querySelector(
    "[data-product-free-shipping-total-amount]"
  )
  const $productFreeShippingFlag = document.querySelector(
    "[data-product-free-shipping-flag]"
  )

  if ($productFreeShippingTotalAmount && $productFreeShippingFlag) {
    const freeShippingByCountries = {
      DE: 50,
      GB: 100,
      AT: 50,
      BE: 75,
      DK: 75,
      FR: 75,
      LU: 75,
      IT: 75,
      MT: 75,
      NL: 75,
      PL: 75,
      SE: 75,
      SK: 75,
      SI: 75,
      ES: 75,
      CZ: 75,
      HU: 75,
      AD: 100,
      BG: 100,
      HR: 100,
      EE: 100,
      FI: 100,
      GR: 100,
      IE: 100,
      LV: 100,
      LT: 100,
      PT: 100,
      RO: 100,
      CH: 100,
    }

    fetch("https://ipinfo.io/json?token=1ab8fd04cabdc4")
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse && jsonResponse.country) {
          const countryCode = jsonResponse.country
          if (typeof freeShippingByCountries[countryCode] === "number") {
            $productFreeShippingFlag.src = `https://flagcdn.com/24x18/${countryCode.toLowerCase()}.png`
            $productFreeShippingTotalAmount.innerText = `${freeShippingByCountries[countryCode]}`

            const $productFreeShippingAmountWrapper = document.querySelector(
              '[data-product-free-shipping-amount-wrapper][data-product-handle="saturo-probierpaket"]'
            )

            if (
              $productFreeShippingAmountWrapper &&
              (countryCode === "AT" || countryCode === "DE")
            ) {
              $productFreeShippingAmountWrapper.classList.add("hidden")
            }
          } else {
          }
        }
      })
  }

  $fixedAddToCart.on("click", function () {
    if ($productFormCartSubmit) {
      $productFormCartSubmit.trigger("click")
    }
  })

  const weglotLinkDE = $('[data-weglot-link="de"]')
  const weglotLinkEN = $('[data-weglot-link="en"]')
  if (weglotLinkDE.length > 0 && weglotLinkEN.length > 0) {
    function toggleFlag(lang) {
      $(`[data-weglot-link="${lang}"]`).toggleClass("hide")
    }

    function redirect(lang) {
      let hostname = window.location.hostname
      if (window.location.hostname.includes("en.")) {
        hostname = window.location.hostname.replace("en.", "")
      }
      const newLocation =
        "https://" +
        lang +
        hostname +
        window.location.pathname +
        window.location.search
      window.location.href = newLocation
    }

    const isEnglish = window.location.host.includes("en.")

    if (isEnglish) {
      weglotLinkDE.addClass("hide")
      weglotLinkEN.addClass("active")

      weglotLinkEN.on("click", () => toggleFlag("de"))
      weglotLinkDE.on("click", () => redirect(""))
    } else {
      weglotLinkEN.addClass("hide")
      weglotLinkDE.addClass("active")

      weglotLinkDE.on("click", () => toggleFlag("en"))
      weglotLinkEN.on("click", () => redirect("en."))
    }
  }

  function changeVariantImage() {
    const selectedValue = document.querySelector(
      ".product-form__variant-selector select.pf-variant-select"
    ).value

    let pageFlyProductsKeys = []
    if (typeof __pageflyProducts != "undefined") {
      pageFlyProductsKeys = Object.keys(__pageflyProducts)
    }
    if (pageFlyProductsKeys.length > 0) {
      const product = __pageflyProducts[pageFlyProductsKeys[0]]
      const variantFilter = product.variants.filter(
        (item) => item.title === selectedValue
      )
      if (variantFilter.length > 0) {
        const imageId = variantFilter[0].featured_image.id
        document.querySelector('[data-img-id="' + imageId + '"]').click()
      }
    }
  }

  function reviewsWidgetResize() {
    if ($(document).scrollTop() >= 25) {
      $("#richSnippetReviewsWidget-defaultContainer").addClass("hideOpacity")
    } else {
      $("#richSnippetReviewsWidget-defaultContainer").removeClass("hideOpacity")
    }
  }

  $(window).resize(function () {
    setTimeout(function () {
      reviewsWidgetResize()
    }, 100)
  })

  $(window).scroll(function () {
    setTimeout(function () {
      reviewsWidgetResize()
    }, 100)
  })

  $(document).ready(function () {
    setTimeout(function () {
      reviewsWidgetResize()
    }, 100)
  })

  //Listen for orientationchange and resize after 1.15 secs
  window.addEventListener(
    "orientationchange",
    function () {
      setTimeout(function () {
        reviewsWidgetResize()
      }, 1150)
    },
    false
  )

  window.addEventListener("Upside::UCD::CartBuilt", function () {
    const $cartCount = $("#CartCount")

    if ($("#ucd-checkout-form[data-items]").length > 0 && $cartCount) {
      const items = $("#ucd-checkout-form[data-items]").attr("data-items")
      $("[data-cart-count]").text(items)
      $cartCount.removeClass("hide")
    } else if ($(".ucd-empty-cart-message").length > 0 && $cartCount) {
      $cartCount.addClass("hide")
    }

    const items = upside.ucd.cart.items

    $(".product__variant[data-variant-id]").each(function (index) {
      const id = $(this).attr("data-variant-id")
      const isOneTime = $(this).hasClass("product__variant__onetime")

      let variantArr = items.filter((item) => {
        if (
          item.variant_id == parseInt(id, 10) &&
          typeof item.selling_plan_allocation == "object"
        ) {
          return true
        }
      })
      if (isOneTime) {
        variantArr = items.filter((item) => {
          if (
            item.variant_id == parseInt(id, 10) &&
            typeof item.selling_plan_allocation != "object"
          ) {
            return true
          }
        })
      }
      if (variantArr.length > 0) {
        $(this).find("[data-variant-qty-input]").val(variantArr[0].quantity)
      } else {
        $(this).find("[data-variant-qty-input]").val(0)
        $(this).closest("[data-variant-wrapper]").removeClass("has-quantity")
      }
    })
  })

  $("[data-scroll-to-product]").on("click", function () {
    $("html").animate(
      {
        scrollTop: $("[data-scroll-product]").offset().top,
      },
      700
    )
  })

  function addToCartWithCallbacks(data, that, errorFn, successFn) {
    jQuery.ajax({
      type: "POST",
      url: "/cart/add.js",
      data: data,
      dataType: "json",
      error: () => {
        errorFn(that)
      },
      success: () => {
        successFn(that)
      },
    })
  }

  $("[data-add-to-cart]").on("click", function () {
    const attr = $(this).attr("data-add-to-cart")
    let variantId = null

    if (attr === "select-id") {
      const selectVal = $(this).closest("form").find('select[name="id"]').val()
      variantId = parseInt(selectVal, 10)
    } else {
      variantId = parseInt($(this).attr("data-add-to-cart"), 10)
    }

    let data = {
      id: variantId,
      quantity: 1,
    }

    function errorFn(that) {
      if (typeof that != "object") {
        setTimeout(() => {
          toggleButtonLoader(that)
        }, 1000)
      }
    }

    function successFn(that) {
      setTimeout(() => {
        toggleButtonLoader(that)
      }, 1000)
      const showDrawer =
        that && typeof $(that).data("variant-btn") === "undefined"
      if (
        typeof upside === "object" &&
        upside &&
        typeof upside.ucd === "object" &&
        upside.ucd.isActive()
      ) {
        upside.ucd.helpers.ajaxCart.load(showDrawer)
      }
    }

    toggleButtonLoader(this)
    addToCartWithCallbacks(data, this, errorFn, successFn)
  })

  $("body").on("click", "[data-back-quiz-results]", function () {
    $("main .shopify-section:not(.personalized-variants__section)").removeClass(
      "hidden"
    )
    $("main .shopify-section.personalized-variants__section").removeClass(
      "show"
    )
    
    if ($('[data-quiz-results-go-to]').length > 0) {
      $('[data-quiz-results-go-to="upsell"]').removeClass('active');
      $('[data-quiz-results-go-to="product"]').removeClass('done').addClass('active');
      setTimeout(function () {
        $('.quiz-product-header__sticky-bar').css('opacity', 1);
      }, 1000)
    }
    
    $("html, body").animate({ scrollTop: 0 })
  })

  $("body").on("click", "[data-quiz-add-to-cart]", function () {
    const qtyNumber = Number($("[data-quiz-qty-number]").val())
    $("main .shopify-section:not(.personalized-variants__section):not(.quiz-header__section)").addClass(
      "hidden"
    )
    $("main .shopify-section.personalized-variants__section").addClass("show")

    if ($('[data-quiz-results-go-to]').length > 0) {
      $('[data-quiz-results-go-to="upsell"]').addClass('active');
      $('[data-quiz-results-go-to="product"]').removeClass('active').addClass('done');
      $('.quiz-product-header__sticky-bar').css('opacity', 0);
    }

    const variantQtyNumber = Number(
      $("[data-variant-wrapper].selected [data-qty-input]").val()
    )
    if (variantQtyNumber < qtyNumber) {
      for (let i = 0; i < qtyNumber - variantQtyNumber; i++) {
        $("[data-variant-wrapper].selected [data-qty-plus]").trigger("click")
      }
    } else if (variantQtyNumber > qtyNumber) {
      for (let i = 0; i < variantQtyNumber - qtyNumber; i++) {
        $("[data-variant-wrapper].selected [data-qty-minus]").trigger("click")
      }
    }

    // Klaviyo event on the button that will show the Upsell step
    var _learnq = window._learnq || []
    _learnq.push([
      "track",
      "Personalized Quiz Added to Cart",
      {
        added_to_cart: "1",
        uid: $("[data-quiz-uid]").attr("data-quiz-uid"),
      },
    ])

    if (typeof dataLayer === "object") {
      dataLayer.push({
        event: "view_personal_order_now", gtm: { quiz_name: "personalized", },
      })
    }

    $("html, body").animate({ scrollTop: 0 })
  })

  $(
    "[data-personalized-variants-items] [data-qty] [data-qty-plus], [data-personalized-variants-items] [data-qty] [data-qty-minus ]"
  ).on("click", function () {
    const qtyNumber = Number($(this).siblings("[data-qty-input]").val())
    $("[data-quiz-qty-number]").val(qtyNumber)
  })

  function closeCollModal() {
    const $collModal = $("[data-coll-modal]")
    $("body").removeClass("coll-modal-opened")
    $collModal.find("[data-coll-modal-content]").remove()
  }

  $("body").on("change", "[data-coll-modal-mode]", function () {
    const value = $(this).val()
    $(this).closest("[data-coll-modal-content]").attr("data-mode", value)

    const $sellingPlanSelect = $("[data-coll-modal] [data-selling-plan-group]")
    if (value === "subscription") {
      $sellingPlanSelect.attr("disabled", false)
    } else {
      $sellingPlanSelect.attr("disabled", true)
    }
  })

  $("body").on("click", "[data-coll-modal-submit]", function () {
    const variantId = parseInt($(this).attr("data-coll-modal-submit"), 10)
    let data = {
      id: variantId,
      quantity: 1,
    }
    const $modalContent = $(this).closest("[data-coll-modal-content]")
    if ($modalContent.attr("data-mode") === "subscription") {
      data.selling_plan = $modalContent.find("[data-selling-plan-group").val()
    }

    function errorFn(that) {
      if (typeof that != "object") {
        setTimeout(() => {
          toggleButtonLoader(that)
        }, 1000)
      }
    }

    function successFn(that) {
      setTimeout(() => {
        toggleButtonLoader(that)
      }, 1000)
      closeCollModal()
      const showDrawer =
        that && typeof $(that).data("variant-btn") === "undefined"
      if (
        typeof upside === "object" &&
        upside &&
        typeof upside.ucd === "object" &&
        upside.ucd.isActive()
      ) {
        upside.ucd.helpers.ajaxCart.load(showDrawer)
      }
    }

    toggleButtonLoader(this)
    addToCartWithCallbacks(data, this, errorFn, successFn)
  })

  $(".personalized-variants__section [data-powder-add-to-cart]").on(
    "click",
    function () {
      var _learnq = window._learnq || []
      _learnq.push([
        "track",
        "Personalized Quiz Added to Cart",
        {
          added_to_cart_2: "1",
        },
      ])
    }
  )

  $("[data-show-coll-modal]").on("click", function () {
    const $collModal = $("[data-coll-modal]")

    const $form = $(this).closest("form")
    const $variantSelect = $form.find("[name=id]")
    const variantText = $variantSelect.find("option:selected").text()
    const variantServingSize = $variantSelect
      .find("option:selected")
      .attr("data-serviing-size")
    const variantId = $variantSelect.val()

    const $content = $form.find("[data-coll-modal-content]")

    $content
      .find("[data-coll-modal-submit]")
      .attr("data-coll-modal-submit", variantId)
    $content.find("[data-variant-title]").text(variantText)
    $content.find("[data-serving-size-size]").text(variantServingSize)

    const $modalContent = $content.clone()

    $modalContent
      .find('[data-coll-modal-mode][value="onetime"]')
      .attr("id", "product-form__onetime-" + variantId)
    $modalContent
      .find('[data-coll-modal-mode][value="onetime"]')
      .siblings("label")
      .attr("for", "product-form__onetime-" + variantId)

    $modalContent
      .find('[data-coll-modal-mode][value="subscription"]')
      .attr("id", "product-form__subscription-" + variantId)
    $modalContent
      .find('[data-coll-modal-mode][value="subscription"]')
      .siblings("label")
      .attr("for", "product-form__subscription-" + variantId)

    $modalContent
      .find("[data-selling-plan-group]")
      .attr("id", "product-form__freq-" + variantId)
    $modalContent
      .find("[data-selling-plan-group]")
      .siblings("label")
      .attr("for", "product-form__freq-" + variantId)

    $modalContent.appendTo($collModal)
    $("body").addClass("coll-modal-opened")
  })

  $("body").on("click", "[data-close-coll-modal]", closeCollModal)

  $(document).keyup(function (e) {
    if (e.which === 27 && $("[data-coll-modal]").length > 0) {
      closeCollModal()
    }
  })

  $("[data-show-product-modal]").on("click", function () {
    const $collModal = $("[data-coll-modal]")

    const $content = $(this).siblings("[data-coll-modal-content]")

    const $modalContent = $content.clone()

    $modalContent.appendTo($collModal)
    $("body").addClass("coll-modal-opened")
  })

  $(window).bind("pageshow", function () {
    if ($(".select").length > 0) {
      $(".select").each(function () {
        setSelectHasOption(this)
      })
    }
  })

  function setSelectHasOption(select) {
    if ($(select).val()) {
      $(select).addClass("has-option")
    } else {
      $(select).removeClass("has-option")
    }
  }

  if ($(".select").length > 0) {
    $(".select").each(function () {
      setSelectHasOption(this)
    })

    $(".select").on("change", function () {
      setSelectHasOption(this)
    })
  }

  if ($(".select[data-variant-selector]").length > 0) {
    $(".select[data-variant-selector]").on("change", function () {
      const $btn = $(this).closest("form").find("[data-requires-variant]")
      if ($(this).val()) {
        $btn.attr("disabled", false)
      } else {
        $btn.attr("disabled", true)
      }
    })
  }

  const $announcementBar = document.querySelector(
    "#shopify-section-announcement-bar"
  );
  if ($announcementBar) { 
    const announcementBarBars =
      $announcementBar.querySelectorAll(".announcement-bar").length
    if (announcementBarBars > 0) {
      const bodyClass = "announcement-bar__visible"
      const iObserver = new IntersectionObserver((items) => {
        if (items[0].isIntersecting) {
          document.body.classList.add(bodyClass)
        } else {
          document.body.classList.remove(bodyClass)
        }
      })
  
      iObserver.observe($announcementBar)
    }
  }
}) // Ends DOM Ready
