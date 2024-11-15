export default function mermaid(md) {
  md.core.ruler.push("mermaid", function (state) {
    const tokens = state.tokens
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === "fence" && tokens[i].info.trim() === "mermaid") {
        const token = tokens[i]
        token.type = "mermaid"
        token.tag = ""
        token.nesting = 0
        token.children = []
        token.content = `<div class="mermaid">${token.content}</div>`
      }
    }
  })

  md.renderer.rules.mermaid = (tokens, idx) => {
    return tokens[idx].content
  }
}
