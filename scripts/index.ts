#!/usr/bin/env node

import process from 'node:process'

import { seedAdminCommand } from './commands/seed-admin.ts'
import { runCli } from './lib/cli.ts'
import { error } from './lib/logging.ts'

runCli({
  commands: [seedAdminCommand],
  argv: process.argv.slice(2),
}).catch((err) => {
  error(err.message)
  process.exitCode = 1
})

