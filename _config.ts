import lume from "lume/mod.ts"

// Custom plugins
import mermaid from "./src/_plugins/markdown/mermaid.js"
import card from "./src/_plugins/markdown/card.js"
import alert from "./src/_plugins/markdown/alert.js"
import brunoLoader from "./src/_plugins/bruno.ts"

// Plugins
import robots from "lume/plugins/robots.ts"
import sitemap from "lume/plugins/sitemap.ts"
import multilanguage from "lume/plugins/multilanguage.ts"
import resolveUrls from "lume/plugins/resolve_urls.ts"
import nav from "lume/plugins/nav.ts"
import sass from "lume/plugins/sass.ts"
import pagefind from "lume/plugins/pagefind.ts"
import redirects from "lume/plugins/redirects.ts";

// Markdown plugins
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts"
import digitalOceanMd from "npm:@digitalocean/do-markdownit"
import prism from "lume/plugins/prism.ts"
import "npm:prismjs@1.29.0/components/prism-json.js"
import "npm:prismjs@1.29.0/components/prism-python.js"
import "npm:prismjs@1.29.0/components/prism-bash.js"

const options = {
  robots: {
    rules: [
      {
        userAgent: "*",
        disallow: "/pagefind",
      },
    ],
  },
  markdown: {
    plugins: [mermaid, card, alert, [digitalOceanMd, { prismjs: false, user_mention: false }]],
  },
  toc: {
    level: 1,
  },
  pagefind: {
    ui: {
      containerId: "search",
      showImages: true,
      excerptLength: 0,
      showEmptyFilters: false,
      showSubResults: false,
      resetStyles: true,
      openFilters: ["web", "api"],
    },
    indexing: {
      verbose: false,
    },
  },
  sass: {
    extensions: [".scss"],
    includes: "_includes/styles",
  },
  multilanguage: {
    languages: ["en", "fr"],
    defaultLanguage: "en",
  },
}

const site = lume({
  src: "./src",
  location: new URL("https://docs.aquarium.app"),
  server: {
    page404: "./404.html",
  },
  watcher: {
    ignore: [
      "/.git",
      (path: string) => path.endsWith("/.DS_Store"),
      (path: string) => path.endsWith("/_screenshots.json"),
    ],
  },
}, { markdown: options.markdown })

site.use(resolveUrls())
site.use(redirects())
site.use(toc(options.toc))
site.use(nav())
site.use(sass(options.sass))
site.use(prism())

site.loadPages([".bru"], brunoLoader)

site.use(multilanguage(options.multilanguage))
site.use(sitemap())
site.use(robots(options.robots))

site.use(pagefind(options.pagefind))

site.copy("_medias")
site.copy("_styles")
site.copy("_js")

site.mergeKey("id", "array")
site.mergeKey("pagefind", "object")

export default site
