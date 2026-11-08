import type { BunPlugin } from 'bun'

const wgslPlugin: BunPlugin = {
    name: 'wgsl-text',
    setup(build) {
        build.onLoad({ filter: /\.wgsl$/ }, async (args) => ({
            contents: await Bun.file(args.path).text(),
            loader: 'text',
        }))
    },
}

export default wgslPlugin
