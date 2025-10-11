#!/usr/bin/env node

import { runRotation } from './lib/aws-key-rotation.ts'

const usage = `Usage: node scripts/rotate-post-artifacts-prod-key.ts [--deactivate OLD_ACCESS_KEY_ID]

Creates a new AWS access key for the Anveio prod post artifacts IAM user.
Optionally deactivates an existing key after successful rotation.

This script requires the AWS CLI to be authenticated with permissions to manage
IAM users within the Anveio AWS account.`

runRotation({
  userName: 'anveio-post-artifacts-prod',
  usage,
  nextSteps: ({ accessKeyId, secretAccessKey }) => [
    'Next steps:',
    '  1. Update Vercel production and preview environment variables:',
    `       vercel env add AWS_ACCESS_KEY_ID production`,
    `       vercel env add AWS_SECRET_ACCESS_KEY production`,
    `       vercel env add AWS_ACCESS_KEY_ID preview`,
    `       vercel env add AWS_SECRET_ACCESS_KEY preview`,
    '  2. Update Convex production environment variables:',
    `       npx convex env set prod AWS_ACCESS_KEY_ID "${accessKeyId}"`,
    `       npx convex env set prod AWS_SECRET_ACCESS_KEY "${secretAccessKey}"`,
    '  3. Redeploy environments so the new credentials take effect.',
    '  4. Once confirmed, disable the previous key (keep a record of the old id for auditing).',
  ].join('\n'),
})
