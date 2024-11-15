// Set theme on html element
function setTheme(theme, dispatch = true) {
  const html = document.documentElement
  const themeIcon = document.querySelector("#theme")

  html.setAttribute("theme", theme)
  localStorage.setItem("preferredTheme", theme)
  themeIcon.innerHTML = theme === "dark" ? "dark_mode" : "light_mode"

  if (dispatch) document.dispatchEvent(new CustomEvent("theme", { detail: theme }))
}

// Set theme & event listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement
  const themeIcon = document.querySelector("#theme")

  const userPrefersDark = () =>
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches

  const loadPreferredTheme = () => {
    let preferredTheme = localStorage.getItem("preferredTheme")

    if (!preferredTheme) {
      preferredTheme = userPrefersDark() ? "dark" : "light"
    }

    setTheme(preferredTheme, false)
  }

  loadPreferredTheme()

  themeIcon.addEventListener("click", () => {
    const currentTheme = html.getAttribute("theme")
    const newTheme = currentTheme === "light" ? "dark" : "light"

    setTheme(newTheme)
  })

  themeIcon.addEventListener("contextmenu", (e) => {
    e.preventDefault()
    localStorage.removeItem("preferredTheme")
    loadPreferredTheme()
  })

  themeIcon.addEventListener("mouseenter", () => {
    themeIcon.innerHTML = html.getAttribute("theme") === "dark" ? "light_mode" : "dark_mode"
  })

  themeIcon.addEventListener("mouseleave", () => {
    themeIcon.innerHTML = html.getAttribute("theme") === "dark" ? "dark_mode" : "light_mode"
  })
})
