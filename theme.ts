
import "lume/types.ts"
import { merge } from "lume/core/utils/object.ts"

import sass from "lume/plugins/sass.ts"

export interface Options {
  sass?: any;
}


const defaults: Options = {
  sass: {
    extensions: [".scss"],
    includes: "_styles",
  },
}

export default function (userOptions?: Partial<Options>) {
  const options = merge(defaults, userOptions)

  return (site: Lume.Site) => {
    site.use(sass(options.sass))

    const files = [
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
      "_components/arrow.vto",
      "_components/button.vto",
      "_components/adjacent.vto",
      "_includes/utils.vto",
    ];

    site.copy('_styles')

    for (const file of files) {
      site.remoteFile(file, import.meta.resolve(`./src/${file}`))
    }
  }
}