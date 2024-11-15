export * as log from "https://deno.land/std@0.218.2/log/mod.ts"
export { Spinner } from "jsr:@std/cli@1.0.5"

export function parseSetCookies(headers: string[]) {
  return headers.map((header: string) => {
    const cookieObj: Record<string, string> = {}

    // Split the header into key-value pairs and attributes
    const parts = header.split(/; */)

    parts.forEach((part, index) => {
      const [key, ...valueParts] = part.split("=")
      const value = valueParts.join("=").trim()

      if (index === 0) {
        // This is the main cookie part
        cookieObj.name = key.trim()
        cookieObj.value = value
      } else {
        // These are the attributes
        cookieObj[key.trim()] = value === "" ? "true" : value
      }
    })

    const url = new URL(Deno.env.get("AQ_API") || "http://localhost:8000")

    // Convert the object to a CookieParam object compatible with Puppeteer
    const cookieParam = {
      name: cookieObj.name,
      value: cookieObj.value,
      domain: url.hostname,
      path: cookieObj.path || "/",
      expires: cookieObj.expires ? new Date(cookieObj.expires).getTime() / 1000 : undefined,
      httpOnly: !!cookieObj.httpOnly,
      secure: !!cookieObj.secure,
      sameSite: cookieObj.sameSite,
    }

    return cookieParam
  })
}

interface Screenshot {
  name: string
  url: string
  click: string[]
  scrollTo: string
  localStorage: Record<string, unknown>
  upload: {
    selector: string
    file: string
  }
  focus: {
    hover: boolean
    selector: string
    type: "arrow"
    color: string
    content: string
    vignetting: boolean
  }[]
}

export async function getAllScreenshots(rootPath = "src") {
  const screenshots: Record<string, Screenshot[]> = {}

  const getScreenshots = async (path: string) => {
    for await (const entry of Deno.readDir(path)) {
      if (entry.isFile && entry.name === "_screenshots.json") {
        const filepath = `${path}/${entry.name}`
        const file = await Deno.readTextFile(`${path}/${entry.name}`)
        screenshots[filepath] = JSON.parse(file)
      } else if (entry.isDirectory) {
        await getScreenshots(`${path}/${entry.name}`)
      }
    }
  }
  await getScreenshots(rootPath)

  if (Object.keys(screenshots).length === 0) {
    throw new Error("No screenshots)")
  }

  // Verify that screenshots are unique. For all non unique screenshot, throw a global error with the name of the file and screenshots names
  const screenshotNames = Object.values(screenshots)
    .map((screenshots) => screenshots.map((screenshot) => screenshot.name))
    .flat()

  const duplicateNames = screenshotNames.filter((name, index) => screenshotNames.indexOf(name) !== index)
  if (duplicateNames.length > 0) {
    const duplicatedScreenshots: Record<string, string[]> = {}
    for (const screenshotName of duplicateNames) {
      duplicatedScreenshots[screenshotName] = Object.keys(screenshots).filter((path) => {
        const s = screenshots[path]
        return s.some((screenshot) => screenshot.name === screenshotName)
      })
    }
    throw new Error(
      `Duplicate screenshot names: ${
        Object.keys(duplicatedScreenshots).map((name) => `\n\t - ${name} (${duplicatedScreenshots[name].join(", ")})`)
          .join(", ")
      }`,
    )
  }

  const allScreenshots = Object.values(screenshots).flat()
  return allScreenshots
}
