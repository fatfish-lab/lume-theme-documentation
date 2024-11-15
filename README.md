# Lume template for documentation

This repository contains a [Lume](https://lume.land) template for documentations.

## Features

A script is responsible to generate screenshots of the web interface of Aquarium. It's stored in the [screenshot folder](screenshot/screenshot.ts). Refer to its dedicated [README](screenshot/README.md) for more information. To use it, create a new task in your deno.json file with the following command: `"screenshot": "deno eval \"import 'documentation/screenshot/screenshot.ts'\""`

Another script is available to check all dead links in the documentation. To run it, use the command `deno task 404`. This script have one option available: `--exclude` to specify domains to exclude from the check. Example: `deno task 404 --exclude google.com --exclude github.com`. If the task 404 is not available, you can create a new task in your deno.json file with the following command: `"404": "deno task lume && echo \"import 'documentation/server.ts'\" | deno run -A - --404"`

## Installation

1. Install [Deno](https://docs.deno.com/runtime/manual/#install-deno)
2. Run the dev server with: `deno task dev`



