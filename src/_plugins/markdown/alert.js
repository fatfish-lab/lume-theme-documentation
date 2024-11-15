export default function alert(md) {
  md.core.ruler.after("block", "alert", function (state) {
    const tokens = state.tokens
    const alertRegex = /\[\!(\w+)\]([^\n\r]*)/i

    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_open') {
        const open = tokens[i]
        const openIndex = i
        while (tokens[i]?.type !== 'blockquote_close' && i <= tokens.length)
          i += 1
        const close = tokens[i]
        const closeIndex = i
        const firstLine = tokens.slice(openIndex, closeIndex + 1).find(token => token.type === 'inline')
        if (!firstLine)
          continue
        const match = firstLine.content.match(alertRegex)
        if (!match)
          continue

        const type = match[1].toLowerCase()
        const title = match[2] ? match[2].trim() : null
        firstLine.content = firstLine.content.slice(match[0].length).trimStart()
        open.tag = 'div'
        open.type = 'alert'
        open.alert = { title, type }

        close.tag = 'div'
        close.type = 'alert_close'
      }
    }
  })

  md.renderer.rules.alert = (tokens, idx) => {
    const { type, title } = tokens[idx].alert
    // FIXME: Not perfect, should append the content in a sub div for better styling/padding
    return `<div class="markdown-alert ${type}">${title ? `<span class="alert-title">${title}</span>` : ''}`
  }
}