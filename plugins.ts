import 'lume/types.ts'
import { merge } from "lume/core/utils/object.ts"
import type { SiteOptions } from "lume/core/site.ts";


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
import pagefind from "lume/plugins/pagefind.ts"
import redirects from "lume/plugins/redirects.ts"
import markdown from "lume/plugins/markdown.ts"


// Markdown plugins
import toc from "https://deno.land/x/lume_markdown_plugins@v0.7.0/toc.ts"
import digitalOceanMd from "npm:@digitalocean/do-markdownit"
import prism from "lume/plugins/prism.ts"
import "npm:prismjs@1.29.0/components/prism-json.js"
import "npm:prismjs@1.29.0/components/prism-python.js"
import "npm:prismjs@1.29.0/components/prism-bash.js"

// FIXME: Improve options interface
export interface Options {
  robots?: any;
  markdown?: any;
  toc?: any;
  pagefind?: any;
  multilanguage?: any;
  server: Partial<SiteOptions["server"]>;
  watcher?: Partial<SiteOptions["watcher"]>;
  bruno?: any;
}

const defaults: Options = {
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
  multilanguage: {
    languages: ["en", "fr"],
    defaultLanguage: "en",
  },
  bruno: {
    enabled: false,
  }
}

/** Configure the site */
export default function (userOptions?: Partial<Options>) {
  const options = merge(defaults, userOptions)

  return (site: Lume.Site) => {
    // site.options.server = merge(site.options.server, options.server)
    // site.options.watcher = merge(site.options.watcher, options.watcher)

    site.use(resolveUrls())
    site.use(redirects())
    site.use(toc(options.toc))
    site.use(nav())
    site.use(markdown(options.markdown))
    site.use(prism())

    if (options.bruno.enabled == true) site.loadPages([".bru"], brunoLoader)

    site.use(multilanguage(options.multilanguage))
    site.use(sitemap())
    site.use(robots(options.robots))

    site.use(pagefind(options.pagefind))

    site.copy('_js')
    const jsFiles = [
      "_js/mermaid.js",
      "_js/search.js",
      "_js/theme.js",
      "_js/toc.js"
    ]
    for (const file of jsFiles) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`));
    }

    site.mergeKey("id", "array")
    site.mergeKey("pagefind", "object")
  }
}