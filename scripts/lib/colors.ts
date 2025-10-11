const wrap = (open: number, close: number) => (value: string): string =>
  `\u001b[${open}m${value}\u001b[${close}m`

export const dim = wrap(2, 22)
export const bold = wrap(1, 22)
export const green = wrap(32, 39)
export const yellow = wrap(33, 39)
export const red = wrap(31, 39)
export const cyan = wrap(36, 39)
