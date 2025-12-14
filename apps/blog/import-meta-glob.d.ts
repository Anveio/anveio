interface ImportMeta {
  glob(
    patterns: string | ReadonlyArray<string>,
    options?: {
      readonly as?: string
      readonly eager?: boolean
      readonly import?: string
      readonly query?: string
    },
  ): Record<string, () => Promise<unknown>>
}

