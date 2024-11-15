import "@std/dotenv/load"

import Aquarium from "https://raw.githubusercontent.com/fatfish-lab/aquarium-ts-api/main/src/index.ts"
import puppeteer from "npm:puppeteer@23.3.0"
import type { Browser, Page } from "npm:puppeteer@23.3.0"

import { parseSetCookies } from "./utils.ts"

const url = new URL("/v1/signin", Deno.env.get("AQ_API"))

const headers = new Headers()
headers.set("Content-Type", "application/json")

const domain = Deno.env.get("AQ_DOMAIN")
if (domain) headers.set("x-aquarium-domain", domain)

const signin = await fetch(url, {
  method: "POST",
  headers,
  body: JSON.stringify({
    "email": Deno.env.get("AQ_EMAIL"),
    "password": Deno.env.get("AQ_PASSWORD"),
  }),
})

if (!signin.ok) {
  throw new Error(`Failed to sign in: ${signin.statusText}`)
}

export class Session {
  aq: Aquarium
  me: Record<string, unknown> | null
  cookies: Record<string, unknown>[]
  browser: Browser
  page: Page

  constructor(
    aq: Aquarium,
    me: Record<string, unknown>,
    cookies: Record<string, unknown>[],
    browser: Browser,
    page: Page,
  ) {
    this.aq = aq
    this.me = me
    this.cookies = []
    this.browser = browser
    this.page = page

    cookies.forEach((cookie) => {
      // @ts-ignore, Can't find type for CookieParam
      this.page.setCookie(cookie)
    })
  }

  static async new() {
    const login = await signin.json()
    const me = login.user
    const token = login.token
    const aq = new Aquarium(Deno.env.get("AQ_API") || "http://localhost:8000", token, Deno.env.get("AQ_DOMAIN"))

    const cookies = parseSetCookies(signin.headers.getSetCookie())

    const options = {
      executablePath: Deno.env.get("PUPPETEER_EXECUTABLE_PATH"),
      devtools: Boolean(Deno.env.get("DEBUG")),
    }
    const browser = await puppeteer.launch(options)

    const page = await browser.newPage()
    await page.setViewport({ width: 1920, height: 1080 })

    await page.goto(Deno.env.get("AQ_WEB") || "http://localhost:3000")
    await page.evaluate(() => {
      localStorage.setItem("alreadyRecoChrome", "true")
    })

    const session = new Session(aq, me, cookies, browser, page)

    return session
  }

  close() {
    return this.browser.close().then(() => Deno.exit(0)).catch(() => Deno.exit(1))
  }
}
