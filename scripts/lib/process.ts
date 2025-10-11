import { spawn } from 'node:child_process'
import process from 'node:process'

export interface RunCommandOptions {
  readonly command: string
  readonly args?: ReadonlyArray<string>
  readonly env?: NodeJS.ProcessEnv
  readonly cwd?: string
  readonly inheritStdio?: boolean
}

export const runCommand = async ({
  command,
  args = [],
  env,
  cwd,
  inheritStdio = true,
}: RunCommandOptions): Promise<void> => {
  const child = spawn(command, args, {
    stdio: inheritStdio ? 'inherit' : 'pipe',
    env: env ?? process.env,
    cwd,
  })

  await new Promise<void>((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`${command} exited with status ${code}`))
      }
    })
  })
}

export const resolveExecutable = (binary: string): string => {
  if (process.platform === 'win32') {
    return `${binary}.cmd`
  }
  return binary
}
