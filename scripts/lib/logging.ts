import process from 'node:process'

import { bold, cyan, dim, green, red, yellow } from './colors.ts'

const writeLine = (stream: NodeJS.WriteStream, message: string): void => {
  stream.write(`${message}\n`)
}

export const log = (message = ''): void => {
  writeLine(process.stdout, message)
}

export const info = (message: string): void => {
  writeLine(process.stdout, `${cyan('ℹ')} ${message}`)
}

export const success = (message: string): void => {
  writeLine(process.stdout, `${green('✔')} ${message}`)
}

export const warn = (message: string): void => {
  writeLine(process.stdout, `${yellow('⚠')} ${message}`)
}

export const error = (message: string): void => {
  writeLine(process.stderr, `${red('✖')} ${message}`)
}

export const headline = (message: string): void => {
  log(bold(message))
}

export const subtle = (message: string): void => {
  log(dim(message))
}
