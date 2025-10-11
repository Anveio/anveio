import { spawnSync } from 'node:child_process'
import process from 'node:process'

type RotationCliOptions = {
  deactivate?: string
  help?: boolean
}

export interface RotationScriptConfig {
  readonly userName: string
  readonly usage: string
  readonly nextSteps: (details: {
    accessKeyId: string
    secretAccessKey: string
  }) => string
}

const resolveCommand = (command: string): string => {
  if (process.platform === 'win32') {
    return `${command}.cmd`
  }
  return command
}

const parseArgs = (argv: ReadonlyArray<string>): RotationCliOptions => {
  const options: RotationCliOptions = {}

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (!arg) continue

    if (!arg.startsWith('-')) {
      throw new Error(`Unknown argument "${arg}". Use --help for usage.`)
    }

    if (arg === '-h' || arg === '--help') {
      options.help = true
      continue
    }

    if (arg === '--deactivate') {
      const value = argv[index + 1]
      if (!value || value.startsWith('-')) {
        throw new Error(
          'The --deactivate flag requires an access key id value.',
        )
      }
      options.deactivate = value
      index += 1
      continue
    }

    throw new Error(`Unknown argument "${arg}". Use --help for usage.`)
  }

  return options
}

const ensureAwsCliAvailability = (): void => {
  const result = spawnSync(resolveCommand('aws'), ['--version'], {
    stdio: 'ignore',
  })
  if (result.error || result.status !== 0) {
    throw new Error(
      'The AWS CLI was not found in PATH. Install it and authenticate before running this script.',
    )
  }
}

const runAwsCommand = (args: ReadonlyArray<string>): string => {
  const result = spawnSync(resolveCommand('aws'), args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.error) {
    throw result.error
  }

  if (result.status !== 0) {
    const stderr = result.stderr?.toString().trim()
    const message =
      stderr && stderr.length > 0
        ? stderr
        : `AWS CLI exited with code ${result.status}`
    throw new Error(message)
  }

  return result.stdout?.toString() ?? ''
}

export const runRotation = (config: RotationScriptConfig): void => {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    process.stdout.write(`${config.usage}\n`)
    return
  }

  ensureAwsCliAvailability()

  const output = runAwsCommand([
    'iam',
    'create-access-key',
    '--user-name',
    config.userName,
    '--query',
    'AccessKey.[AccessKeyId,SecretAccessKey]',
    '--output',
    'text',
  ]).trim()

  const [accessKeyId, secretAccessKey] = output.split(/\s+/)
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      'Failed to parse AWS CLI output. Ensure the command returned the expected values.',
    )
  }

  const summary = [
    '',
    `✅ Generated new AWS access key for ${config.userName}`,
    `  AWS_ACCESS_KEY_ID=${accessKeyId}`,
    `  AWS_SECRET_ACCESS_KEY=${secretAccessKey}`,
    '',
    'Store the credentials in a secure secrets manager immediately.',
    '',
    config.nextSteps({ accessKeyId, secretAccessKey }),
    '',
  ]

  process.stdout.write(summary.join('\n'))

  if (options.deactivate) {
    runAwsCommand([
      'iam',
      'delete-access-key',
      '--user-name',
      config.userName,
      '--access-key-id',
      options.deactivate,
    ])
    process.stdout.write(
      `🚮 Removed old access key ${options.deactivate} for ${config.userName}\n`,
    )
  }
}

