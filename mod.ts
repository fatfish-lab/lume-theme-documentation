
import "lume/types.ts"

import theme, { Options as ThemeOptions } from "./theme.ts"
import plugins, { Options as PluginOptions } from "./plugins.ts"

export default function (pluginOptions: Partial<PluginOptions> = {}, themeOptions: Partial<ThemeOptions> = {}) {
  return (site: Lume.Site) => {
    site.use(plugins(pluginOptions))
    site.use(theme(themeOptions))

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
      "_includes/sidebar_item.vto",
      "_includes/sidebar.vto",
      "_includes/header.vto",
      "_data.yml",
      "_components/search.vto",
      "_components/shortcut.vto",
      "_components/index.vto",
      "_components/summary.vto",
      "_plugins/markdown/mermaid.js",
      "_plugins/markdown/alert.js",
      "_plugins/markdown/card.js",
      "_plugins/bruno.ts",
      "404.md",
      "index.scss",
    ];

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`))
    }
  }
}