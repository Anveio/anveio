import { resolveExecutable, runCommand } from './process.ts'

export interface ConvexActionOptions {
  readonly action: string
  readonly payload: unknown
}

export const runConvexAction = async ({
  action,
  payload,
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
  })
}
