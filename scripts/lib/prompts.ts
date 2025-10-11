import process from 'node:process'

import {
  confirm,
  input as inputPrompt,
  password as passwordPrompt,
} from '@inquirer/prompts'

const assertInteractive = () => {
  if (!process.stdout.isTTY) {
    throw new Error(
      'Interactive prompting is unavailable because the current stdout is not a TTY. Please supply the required flags instead.',
    )
  }
}

export interface TextPromptOptions {
  readonly message: string
  readonly defaultValue?: string
  readonly validate?: (value: string) => string | true
}

export interface PasswordPromptOptions {
  readonly message: string
  readonly validate?: (value: string) => string | true
}

export interface ConfirmPromptOptions {
  readonly message: string
  readonly defaultValue?: boolean
}

export const promptText = async ({
  message,
  defaultValue,
  validate,
}: TextPromptOptions): Promise<string> => {
  assertInteractive()
  return inputPrompt({
    message,
    default: defaultValue,
    validate: validate ?? (() => true),
  })
}

export const promptPassword = async ({
  message,
  validate,
}: PasswordPromptOptions): Promise<string> => {
  assertInteractive()
  return passwordPrompt({
    message,
    mask: true,
    validate: validate ?? (() => true),
  })
}

export const promptConfirm = async ({
  message,
  defaultValue = false,
}: ConfirmPromptOptions): Promise<boolean> => {
  assertInteractive()
  return confirm({
    message,
    default: defaultValue,
  })
}
