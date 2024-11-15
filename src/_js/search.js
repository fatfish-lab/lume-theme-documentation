document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("keypress", (e) => {
    if (e.key === "/") {
      const search = document.querySelector("input.pagefind-ui__search-input")
      if (search) {
        e.preventDefault()
        search.focus()
      }
    }
  })

  const searchIcon = document.querySelector("#search-container > .search-icon")
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
