function getMermaidConfig(theme = "light") {
  return {
    startOnLoad: true,
    theme: "base",
    securityLevel: "strict",
    darkMode: theme == "dark",
    themeVariables: {
      darkMode: theme == "dark",
      contrast: "#adb5bd",
      primaryColor: "#eee",
      background: "#fff",
      mainBkg: "#adb5bd",
      lineColor: "#ced4da",
      border1: "#22b8cf",
      critical: "#ff6b6b",
      done: "#51cf66",
      arrowheadColor: "#22b8cf",
      noteBkgColor: "#fcc419",
      fontFamily: "monospace",
    },
    flowchart: {
      curve: "linear",
      padding: 22,
    },
    sequence: {
      noteMargin: 24,
    },
  }
}
function setMermaidTheme(theme = "light") {
  const config = getMermaidConfig(theme)
  mermaid.initialize(config)
  mermaid.init(config, document.querySelectorAll(".mermaid"))
}

function saveMermaidData() {
  const $mermaid = document.querySelectorAll(".mermaid")
  $mermaid.forEach((element) => {
    element.setAttribute("data-mermaid-code", element.innerHTML)
  })
}

function resetProcessed() {
  const $mermaid = document.querySelectorAll(".mermaid")
  $mermaid.forEach((element) => {
    if (element.getAttribute("data-mermaid-code") != null) {
      element.removeAttribute("data-processed")
      element.innerHTML = element.getAttribute("data-mermaid-code")
    }
  })
}

document.addEventListener("DOMContentLoaded", () => {
  saveMermaidData()

  const theme = document.documentElement.getAttribute("theme")
  setMermaidTheme(theme)
})

document.addEventListener("theme", (e) => {
  resetProcessed()

  const theme = e.detail
  setMermaidTheme(theme)
})
