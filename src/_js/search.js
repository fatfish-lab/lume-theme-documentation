document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keypress", (e) => {
    if (e.key === "/") {
      const search = document.querySelector("input.pagefind-ui__search-input")
      if (search) {
        e.preventDefault()
        search.focus()
      }
    } else if (e.key === "Escape") {
      const search = document.querySelector("input.pagefind-ui__search-input")
      if (search) {
        e.preventDefault()
        search.blur()
      }
    }
  })

  const searchIcon = document.querySelector("#search-trigger")
  if (searchIcon) {
    searchIcon.addEventListener("click", (e) => {
      const search = document.querySelector("input.pagefind-ui__search-input")
      if (search) {
        e.preventDefault()
        search.focus()
      }
    })
  }
})
