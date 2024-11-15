# Screenshot script

This script allows to automate screenshot of the interface and add interest points on the image. It's using puppeteer to generate the screenshots.

The screenshots data used to generate the images are stored in each main folders as `_screenshots.json` file.

> _screenshots.json files can be stored anywhere in the documentation. But we choosed to store them in the main folders to keep the data close to the content.

## Usage

1. At the root of this repository, copy the [`.env.default`](../.env.default) file to `.env` and update the values.
2. Install Puppeteer with the command `PUPPETEER_PRODUCT=chrome deno run -A --unstable https://deno.land/x/puppeteer@16.2.0/install.ts`.
   - If you want to install another version of Chrome, please refer to section below.
3. Run the command `deno task screenshot` to generate the screenshots.

### How to install another version of Chrome ?

1. Select a revision of Chrome from the [Chromium Dash](https://chromiumdash.appspot.com/releases?platform=Mac). The revision number consists of digits like `1313161`.
2. Once you selected the revision, download the Chromium zip file from [the buckets](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html) by selecting your platform and the revision number.
3. Unzip the file and store it where you want.
4. Store the path to the executable in the `.env` file with the key `PUPPETEER_EXECUTABLE_PATH`.
5. Run the command `deno task screenshot`
   1. You can also use this command to specify the path: `PUPPETEER_EXECUTABLE_PATH=/path/to/Chromium deno task screenshot`

> [!IMPORTANT]
>If you are on macOS, you need to select the actual executable not the Chromium.app. You need to open the content of the app and select the `Chromium` executable: `path/to/Chromium.app/Contents/MacOS/Chromium`.
>
>If you try to open Chromium.app manually, you may have a security warning. You need to run the command `xattr -r -d com.apple.quarantine /path/to/Chromium/Chromium.app` to remove the quarantine attribute from the Chromium app.


### Options

This command accept the following options:

- `--path`: Select the path to look for `_screenshots.json` files. Default to `src`.
- `--debug`: Run puppeteer in debug mode. Default to `false`.
- `deno task screenshot [name-of-screenshot]`: Generate a specific screenshot based on its name. By default, all screenshots are generated.