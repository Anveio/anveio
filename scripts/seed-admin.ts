#!/usr/bin/env node

import { spawn } from 'node:child_process'
import process from 'node:process'

const HELP_TEXT = `Usage:
  node scripts/seed-admin.ts --email <email> --password <password> [--name <name>]

Options:
  --email      Required. Email address for the admin account.
  --password   Required. Password for the admin account.
  --name       Optional. Display name for the admin account (defaults to "Site Admin").
  --help       Show this help message.

Example:
  node scripts/seed-admin.ts --email admin@example.com --password "correct horse battery staple" --name "Site Admin"
`

type CliOptions = {
  help?: boolean
  email?: string
  password?: string
  name?: string
}

type SeedPayload = {
  email: string
  password: string
  name?: string
}

const parseArgs = (argv: ReadonlyArray<string>): CliOptions => {
  const options: CliOptions = {}

  for (let index = 0; index < argv.length; index += 1) {
    const raw = argv[index]!

    if (!raw.startsWith('--')) {
      throw new Error(
        `Unexpected argument "${raw}". Use --help to see supported options.`,
      )
    }

    const [flag, valueFromEquals] = raw.split('=', 2)
    const key = flag.slice(2)

    if (key === 'help') {
      options.help = true
      continue
    }

    let value = valueFromEquals
    if (value === undefined) {
      const next = argv[index + 1]
      if (!next || next.startsWith('--')) {
        throw new Error(
          `Flag "--${key}" requires a value. Use --help for usage details.`,
        )
      }
      value = next
      index += 1
    }

    if (key !== 'email' && key !== 'password' && key !== 'name') {
      throw new Error(
        `Unsupported flag "--${key}". Use --help to see supported options.`,
      )
    }

    options[key] = value
  }

  return options
}

const normalizeName = (input?: string): string | undefined => {
  if (!input) return undefined
  const trimmed = input.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

const resolveSpawnCommand = (command: string): string => {
  if (process.platform === 'win32') {
    return `${command}.cmd`
  }
  return command
}

const runConvexSeed = async (payload: SeedPayload): Promise<void> => {
  const args = [
    'convex',
    'run',
    'dev.seedAdmin',
    '--args',
    JSON.stringify(payload),
  ]

  const child = spawn(resolveSpawnCommand('npx'), args, {
    stdio: 'inherit',
    env: process.env,
  })

  await new Promise<void>((resolve, reject) => {
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`convex run exited with code ${code}`))
      }
    })
  })
}

const main = async (): Promise<void> => {
  const argv = process.argv.slice(2)
  const options = parseArgs(argv)

  if (options.help) {
    process.stdout.write(HELP_TEXT)
    return
  }

  const email = options.email ?? process.env.ADMIN_SEED_EMAIL
  const password = options.password ?? process.env.ADMIN_SEED_PASSWORD
  const name = normalizeName(options.name ?? process.env.ADMIN_SEED_NAME)

  if (!email) {
    throw new Error(
      'Missing required admin email. Pass --email or set ADMIN_SEED_EMAIL.',
    )
  }

  if (!password) {
    throw new Error(
      'Missing required admin password. Pass --password or set ADMIN_SEED_PASSWORD.',
    )
  }

  const payload: SeedPayload = {
    email,
    password,
    ...(name ? { name } : {}),
  }

  await runConvexSeed(payload)
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`)
  process.exitCode = 1
})

