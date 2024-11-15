import Server from "lume/core/server.ts"
import { parseArgs } from "jsr:@std/cli/parse-args"
import { walk } from "jsr:@std/fs/walk"
import { DOMParser, HTMLDocument } from "jsr:@b-fuze/deno-dom"
import { Spinner } from "./screenshot/utils.ts"

const spinner = new Spinner({ message: "Checking 404 errors...", color: "yellow" })

const args = parseArgs(Deno.args, {
  boolean: ["404"],
  string: ["port"],
  collect: ["exclude"],
  default: {
    exclude: ["google.com", "github.com"],
  },
})

const server = new Server({
  port: args.port ? Number(args.port) : 8010,
  root: `${Deno.cwd()}/_site`,
})

async function searchFor404() {
  if (args.exclude) {
    console.log("Excluding URL using:", args.exclude)
  }

  const base = `http://localhost:${args.port || 8010}`

  function getAttributes(doc: HTMLDocument, tag: string, attr: string) {
    const elements = Array.from(doc.querySelectorAll(tag))
    // @ts-ignore Element is not recognized from the NodeList
    return elements.map((el) => el.getAttribute(attr))
  }

  // Walk to find all .html files
  const htmlFiles = await Array.fromAsync(walk(`${Deno.cwd()}/_site`, { exts: ["html"] }))
  let index = 0
  spinner.start()
  for await (const file of htmlFiles) {
    index++
    spinner.message = `Checking 404 errors (${index}/${htmlFiles.length})...`

    let has404 = false
    const html = await Deno.readTextFile(file.path)
    const doc = new DOMParser().parseFromString(html, "text/html")
    const urls = [
      ...getAttributes(doc, "a", "href"),
      ...getAttributes(doc, "img", "src"),
      ...getAttributes(doc, "video", "src"),
      ...getAttributes(doc, "audio", "src"),
    ]

    for (const url of urls) {
      if (!url) continue
      if (url.startsWith("mailto")) continue

      let Url
      try {
        if (!url.startsWith("http")) {
          const location = file.path.split("/_site/")[1].replace("index.html", "")
          Url = new URL(url, `${base}/${location}`)
        } else {
          Url = new URL(url)
        }
      } catch {
        throw new Error(`Invalid URL: ${url} on file ${file.path}`)
      }

      const response = await fetch(Url.href)
      if (response.ok === false) {
        const domainToExclude = args.exclude as string[] || []
        if (domainToExclude.some((e) => url.toString().includes(e))) continue
        if (has404 == false) {
          has404 = true
          console.error(`\n404 errors on ${file.path}:`)
        }

        const isURLEqualToHref = Url.toString() == url
        console.error(`\t- ${url} ${isURLEqualToHref ? "" : `| ${Url.href}`}`)
      }
    }
  }
}

if (args["404"]) {
  server.addEventListener("start", async () => {
    await searchFor404()
    Deno.exit(0)
  })
}

try {
  server.start()
} catch (e) {
  if (e instanceof Deno.errors.AddrInUse && args["404"]) searchFor404()
  else throw e
}
