export const adminStackClass =
  'flex flex-col gap-8 text-slate-900 dark:text-slate-100'

export const adminCardClass =
  'rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/60'

export const adminMutedTextClass =
  'text-sm text-slate-500 dark:text-slate-400'

export const adminFormFieldClass = 'flex flex-col gap-2'

export const adminInputClass =
  'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-blue-400 dark:focus:ring-blue-200/40'

export const adminTextareaClass = `${adminInputClass} min-h-[7rem] resize-y`

export const adminSelectClass = adminInputClass

export const adminButtonClass =
  'inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100'

export const adminPrimaryButtonClass =
  'inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300 dark:bg-blue-500 dark:hover:bg-blue-400'

export const adminLinkButtonClass =
  'text-sm font-semibold text-blue-600 transition hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300'

export const adminBadgeBaseClass =
  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition'

export const adminBadgeVariants = {
  draft:
    'bg-amber-100 text-amber-900 ring-1 ring-inset ring-amber-200 dark:bg-amber-400/20 dark:text-amber-200 dark:ring-amber-400/30',
  published:
    'bg-emerald-100 text-emerald-900 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-400/20 dark:text-emerald-200 dark:ring-emerald-400/30',
  archived:
    'bg-slate-200 text-slate-700 ring-1 ring-inset ring-slate-300 dark:bg-slate-800/40 dark:text-slate-200 dark:ring-slate-500/40',
} as const
