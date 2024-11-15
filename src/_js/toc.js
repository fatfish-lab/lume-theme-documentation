const anchors = []
const details = []
const headings = ["h1", "h2"]
const headingsInDetails = ["h3"]

const getTocAnchorById = (id) => {
  const selector = `nav.toc ol li a[href="#${id}"]`
  return document.querySelector(selector)
}

function highlightToc() {
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop

  anchors.forEach((anchor) => {
    const heading = getTocAnchorById(anchor.getAttribute("id"))
    if (heading) heading.classList.remove("active")
  })

  const closestAnchor = anchors.reverse().reduce((closest, anchor) => {
    const anchorTop = anchor.getBoundingClientRect().top + window.scrollY - 68
    const distance = Math.abs(scrollTop - anchorTop)

    if (distance < closest.distance) {
      return { anchor, distance }
    } else {
      return closest
    }
  }, { anchor: null, distance: Infinity }).anchor

  if (closestAnchor) {
    const tocHeading = getTocAnchorById(closestAnchor.getAttribute("id"))
    if (tocHeading) {
      tocHeading.classList.add("active")
      const detail = tocHeading.closest("details")
      if (detail) {
        detail.open = true
        details
          .filter((d) => d !== detail)
          .forEach((d) => d.open = false)
      }
    }
  }
}

function scrollIntoSidebar() {
  const activeShortcuts = document.querySelectorAll("nav ol:nth-of-type(2) .shortcut.active")
  if (activeShortcuts.length) {
    const last = activeShortcuts[activeShortcuts.length - 1]
    last.scrollIntoView({ block: "center" })
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const selectors = [headings, headingsInDetails].flatMap((h) => `#content ${h}`)
  document.querySelectorAll(selectors.join(", ")).forEach((anchor) => anchors.push(anchor))

  const $details = document.querySelectorAll("nav.toc details")
  $details.forEach((detail) => details.push(detail))

  highlightToc()
  scrollIntoSidebar()
})

document.addEventListener("scroll", function () {
  highlightToc()
})
