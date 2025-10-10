#!/usr/bin/env bash

set -euo pipefail

USER_NAME="anveio-post-artifacts-dev"
AWS_API_QUERY='AccessKey.[AccessKeyId,SecretAccessKey]'

print_usage() {
  cat <<'USAGE'
Usage: ./rotate-post-artifacts-dev-key.sh [--deactivate OLD_ACCESS_KEY_ID]

Creates a new AWS access key for the Anveio dev post artifacts IAM user.
Optionally deactivates an existing key after successful rotation.

This script requires the AWS CLI to be authenticated with permissions to manage
IAM users within the Anveio AWS account.
USAGE
}

OLD_KEY=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --deactivate)
      OLD_KEY="${2:-}"
      if [[ -z "$OLD_KEY" ]]; then
        echo "error: --deactivate flag requires an access key id argument" >&2
        exit 1
      fi
      shift 2
      ;;
    -h|--help)
      print_usage
      exit 0
      ;;
    *)
      echo "error: unknown argument '$1'" >&2
      print_usage
      exit 1
      ;;
  esac
done

if ! command -v aws >/dev/null 2>&1; then
  echo "error: aws CLI not found in PATH" >&2
  exit 1
fi

ACCESS_KEY_OUTPUT=$(aws iam create-access-key \
  --user-name "$USER_NAME" \
  --query "$AWS_API_QUERY" \
  --output text)

ACCESS_KEY_ID=$(echo "$ACCESS_KEY_OUTPUT" | awk '{print $1}')
SECRET_ACCESS_KEY=$(echo "$ACCESS_KEY_OUTPUT" | awk '{print $2}')

cat <<ROTATION_NOTICE

✅ Generated new AWS access key for $USER_NAME
  AWS_ACCESS_KEY_ID=$ACCESS_KEY_ID
  AWS_SECRET_ACCESS_KEY=$SECRET_ACCESS_KEY

Store the credentials in a secure secrets manager immediately.

Next steps:
  1. Update Vercel dev environment variables (pasting values when prompted):
       vercel env add AWS_ACCESS_KEY_ID development
       vercel env add AWS_SECRET_ACCESS_KEY development
  2. Update Convex dev env vars:
       npx convex env set dev AWS_ACCESS_KEY_ID "$ACCESS_KEY_ID"
       npx convex env set dev AWS_SECRET_ACCESS_KEY "$SECRET_ACCESS_KEY"
  3. Redeploy environments so the new credentials take effect.
  4. Once confirmed, disable the previous key (keep a record of the old id for auditing).

ROTATION_NOTICE

if [[ -n "$OLD_KEY" ]]; then
  aws iam delete-access-key --user-name "$USER_NAME" --access-key-id "$OLD_KEY"
  echo "🚮 Removed old access key $OLD_KEY for $USER_NAME"
fi
