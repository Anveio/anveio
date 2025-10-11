export interface ParsedFlags {
  readonly flags: Record<string, string | boolean>
  readonly positionals: ReadonlyArray<string>
}

const isFlag = (value: string): boolean => value.startsWith('--')

export const parseFlags = (argv: ReadonlyArray<string>): ParsedFlags => {
  const flags: Record<string, string | boolean> = {}
  const positionals: string[] = []

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index]
    if (!token) continue

    if (!isFlag(token)) {
      positionals.push(token)
      continue
    }

    const [rawName, fromEquals] = token.slice(2).split('=', 2)
    if (!rawName) {
      throw new Error(`Invalid flag syntax "${token}".`)
    }

    if (fromEquals !== undefined) {
      flags[rawName] = fromEquals
      continue
    }

    const lookahead = argv[index + 1]
    if (lookahead === undefined || isFlag(lookahead)) {
      flags[rawName] = true
      continue
    }

    flags[rawName] = lookahead
    index += 1
  }

  return { flags, positionals }
}
