import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { resolveExecutable, runCommand } from './process.ts'

const repoRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
)
const defaultCwd = path.join(repoRoot, 'apps', 'blog')

export interface ConvexActionOptions {
  readonly action: string
  readonly payload: unknown
  readonly cwd?: string
}

export const runConvexAction = async ({
  action,
  payload,
  cwd,
}: ConvexActionOptions): Promise<void> => {
  const args = [
    'convex',
    'run',
    action,
    JSON.stringify(payload),
  ]

  await runCommand({
    command: resolveExecutable('npx'),
    args,
    cwd: cwd ?? defaultCwd,
  })
}
