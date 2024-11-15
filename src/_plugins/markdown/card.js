export default function card(md) {
  md.core.ruler.push("card", function (state) {
    const tokens = state.tokens
    const cardRegex = /^card\s*\[(.*?)\]\((.*?)\)$/

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "fence" && cardRegex.test(tokens[i].info.trim())) {
        const token = tokens[i]
        const match = tokens[i].info.trim().match(cardRegex)
        const title = match[1].trim()
        const link = match[2].trim()
        const content = token.content.trim()

        token.type = "card"
        token.tag = ""
        token.nesting = 0
        token.children = []
        token.title = title
        token.link = link
        token.content = content
      }
    }
  })

  md.renderer.rules.card = (tokens, idx) => {
    const token = tokens[idx]
    return `
    <article class="card">
      <a href="${token.link}">
        <h4 class="card-title">${token.title}</h4>
        <p class="card-content">${token.content.split("\n").join("<br/>")}</p>
      </a>
    </article>`
  }
}
