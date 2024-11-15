
import "lume/types.ts"

export type { Options } from "./plugins.ts"
import plugins, { Options } from "./plugins.ts"

export default function (options: Partial<Options> = {}) {
  return (site: Lume.Site) => {
    site.use(plugins(options))

    const files = [
      "_includes/documentation/main.vto",
      "_includes/documentation/index.vto",
      "_includes/documentation/toc.vto",
      "_includes/documentation/footer.vto",
      "_includes/contact.vto",
      "_includes/homepage/hero.vto",
      "_includes/homepage/index.vto",
      "_includes/bruno/main.vto",
      "_includes/bruno/index.vto",
      "_includes/utils.vto",
      "_includes/sidebar_item.vto",
      "_includes/sidebar.vto",
      "_includes/header.vto",
      "_data.yml",
      "index.scss",
      "_styles/markdown/_code.scss",
      "_styles/markdown/_details.scss",
      "_styles/markdown/_highlight.scss",
      "_styles/markdown/_columns.scss",
      "_styles/markdown/index.scss",
      "_styles/markdown/_typography.scss",
      "_styles/markdown/_code_prefix.scss",
      "_styles/markdown/_twitter.scss",
      "_styles/markdown/_heading_id.scss",
      "_styles/markdown/digitalocean/index.scss",
      "_styles/markdown/digitalocean/_code_environments.scss",
      "_styles/markdown/digitalocean/_callouts.scss",
      "_styles/markdown/_terminal_button.scss",
      "_styles/markdown/_compare.scss",
      "_styles/markdown/_code_secondary_label.scss",
      "_styles/markdown/_slideshow.scss",
      "_styles/markdown/_tables.scss",
      "_styles/markdown/_images.scss",
      "_styles/markdown/_table_wrapper.scss",
      "_styles/markdown/_vimeo.scss",
      "_styles/markdown/_mixins.scss",
      "_styles/markdown/_code_prism.scss",
      "_styles/markdown/_rsvp_button.scss",
      "_styles/markdown/_wistia.scss",
      "_styles/markdown/_callouts.scss",
      "_styles/markdown/_code_label.scss",
      "_styles/markdown/_instagram.scss",
      "_styles/markdown/_youtube.scss",
      "_styles/markdown/_theme.scss",
      "_styles/button.scss",
      "_styles/mermaid.scss",
      "_styles/vars.scss",
      "_styles/chip.scss",
      "_styles/theme.scss",
      "_styles/icons.scss",
      "_js/mermaid.js",
      "_js/toc.js",
      "_js/theme.js",
      "_js/search.js",
      "_medias/favicon.png",
      "_components/search.vto",
      "_components/shortcut.vto",
      "_components/arrow.vto",
      "_components/index.vto",
      "_components/summary.vto",
      "_components/button.vto",
      "_components/adjacent.vto",
      "_plugins/markdown/mermaid.js",
      "_plugins/markdown/alert.js",
      "_plugins/markdown/card.js",
      "_plugins/bruno.ts",
      "404.md"
    ];

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`))
    }
  }
}