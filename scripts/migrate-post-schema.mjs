#!/usr/bin/env node

/**
 * Placeholder migration script for transitioning existing markdown posts into
 * the structured Convex schema (post, postRevision, postFragment, etc.).
 *
 * The actual migration will be implemented once the publish pipeline is ready.
 * For now, we detect accidental invocation and provide guidance.
 */
console.error(
  [
    'Not implemented:',
    'The post schema migration will be delivered alongside the publish pipeline.',
    'Track progress at context/design-docs/post-publishing-implementation.md.',
  ].join(' '),
)
process.exit(1)
