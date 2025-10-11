import process from 'node:process'

import { select } from '@inquirer/prompts'

import { bold, dim } from './colors.ts'
import { error, headline, log, subtle } from './logging.ts'

export interface CommandRunContext {
  readonly argv: ReadonlyArray<string>
}

export interface CommandDefinition {
  readonly name: string
  readonly summary: string
  readonly usage: string
  readonly description?: string
  readonly help?: string
  readonly run: (context: CommandRunContext) => Promise<void>
}

const commandMap = (
  commands: ReadonlyArray<CommandDefinition>,
): Map<string, CommandDefinition> =>
  new Map(commands.map((command) => [command.name, command]))

const printGlobalHelp = (
  commands: ReadonlyArray<CommandDefinition>,
): void => {
  headline('Available commands')
  log()
  for (const command of commands) {
    log(`${bold(command.name)}  ${dim(command.summary)}`)
  }
  log()
  subtle(
    'Invoke a command with `node scripts/index.ts <command> --help` to see details.',
  )
}

const printCommandHelp = (command: CommandDefinition): void => {
  headline(`Command: ${command.name}`)
  log()
  log(bold('Usage'))
  log(`  ${command.usage}`)
  if (command.description) {
    log()
    log(bold('Description'))
    log(`  ${command.description}`)
  }
  if (command.help) {
    log()
    log(command.help)
  }
}

const isHelpRequest = (value: string | undefined): boolean =>
  value === '-h' || value === '--help' || value === 'help'

export interface RunCliOptions {
  readonly commands: ReadonlyArray<CommandDefinition>
  readonly argv: ReadonlyArray<string>
}

export const runCli = async ({
  commands,
  argv,
}: RunCliOptions): Promise<void> => {
  if (commands.length === 0) {
    throw new Error('No commands registered.')
  }

  const registry = commandMap(commands)

  const [first, ...rest] = argv

  if (!first || isHelpRequest(first)) {
    if (!process.stdout.isTTY || isHelpRequest(first)) {
      printGlobalHelp(commands)
      return
    }

    const selected = await select({
      message: 'Select a task to run',
      choices: [
        ...commands.map((command) => ({
          name: `${command.name} — ${command.summary}`,
          value: command.name,
        })),
        {
          name: 'Exit',
          value: '__exit__',
        },
      ],
    })

    if (selected === '__exit__') {
      return
    }

    const command = registry.get(selected)
    if (!command) {
      throw new Error(`Command "${selected}" not registered.`)
    }

    await command.run({ argv: [] })
    return
  }

  const command = registry.get(first)
  if (!command) {
    error(`Unknown command "${first}".`)
    log()
    printGlobalHelp(commands)
    process.exitCode = 1
    return
  }

  if (rest.length > 0 && isHelpRequest(rest[0])) {
    printCommandHelp(command)
    return
  }

  await command.run({ argv: rest })
}

export const runSingleCommand = async (
  command: CommandDefinition,
  argv: ReadonlyArray<string>,
): Promise<void> => {
  if (argv.length > 0 && isHelpRequest(argv[0])) {
    printCommandHelp(command)
    return
  }

  await command.run({ argv })
}
