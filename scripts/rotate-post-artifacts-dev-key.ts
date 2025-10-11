#!/usr/bin/env node

import { runRotation } from './lib/aws-key-rotation.ts'

const usage = `Usage: node scripts/rotate-post-artifacts-dev-key.ts [--deactivate OLD_ACCESS_KEY_ID]

Creates a new AWS access key for the Anveio dev post artifacts IAM user.
Optionally deactivates an existing key after successful rotation.

This script requires the AWS CLI to be authenticated with permissions to manage
IAM users within the Anveio AWS account.`

runRotation({
  userName: 'anveio-post-artifacts-dev',
  usage,
  nextSteps: ({ accessKeyId, secretAccessKey }) => [
    'Next steps:',
    '  1. Update Vercel development environment variables (paste values when prompted):',
    `       vercel env add AWS_ACCESS_KEY_ID development`,
    `       vercel env add AWS_SECRET_ACCESS_KEY development`,
    '  2. Update Convex development environment variables:',
    `       npx convex env set dev AWS_ACCESS_KEY_ID "${accessKeyId}"`,
    `       npx convex env set dev AWS_SECRET_ACCESS_KEY "${secretAccessKey}"`,
    '  3. Redeploy environments so the new credentials take effect.',
    '  4. Once confirmed, disable the previous key (keep a record of the old id for auditing).',
  ].join('\n'),
})
