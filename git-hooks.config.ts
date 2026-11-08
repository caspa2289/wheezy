import type { GitHooksConfig } from 'bun-git-hooks'

const config: GitHooksConfig = {
    'pre-commit': 'bun fmt --staged',
}

export default config
