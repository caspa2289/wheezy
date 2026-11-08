import { $ } from 'bun'
import wgslPlugin from './wgsl-plugin'

await $`rm -rf dist`

const result = await Bun.build({
    entrypoints: ['./index.html'],
    outdir: './dist',
    sourcemap: 'inline',
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    naming: {
        entry: '[name].[ext]',
        chunk: '[name]-[hash].[ext]',
        asset: '[name]-[hash].[ext]',
    },
    plugins: [wgslPlugin],
})

if (!result.success) {
    console.error(result.logs)
    process.exit(1)
}

for await (const file of new Bun.Glob('**/*').scan('assets')) {
    await Bun.write(`dist/static/${file}`, Bun.file(`assets/${file}`))
}

console.log('Build complete → dist/')
