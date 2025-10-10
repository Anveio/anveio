# Runbook: Post Artifact AWS Key Rotation

## Purpose
Rotate IAM access keys for the S3 buckets that store published blog post artifacts. Keys exist in two environments:

- `anveio-post-artifacts-dev`
- `anveio-post-artifacts-prod`

Both must be rotated on a regular cadence (recommended every 60 days) and whenever compromise is suspected.

## Prerequisites
- AWS CLI v2 configured with credentials authorized to manage IAM users in the Anveio account.
- Access to Vercel project environment settings (Development, Preview, Production).
- Access to Convex environment management (`npx convex env ...`).
- Secure secret storage for temporary handling of new keys (e.g., 1Password, Secrets Manager).

## Rotation Steps

### 1. Generate Replacement Keys

Run the helper script for the target environment:

```bash
# Development
./scripts/rotate-post-artifacts-dev-key.sh

# Production (updates both Preview + Production in Vercel)
./scripts/rotate-post-artifacts-prod-key.sh
```

The script outputs a new `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. Store these values in a secure location immediately; they are only displayed once.

### 2. Update Vercel Environment Variables

For each environment, run the following and paste the new values when prompted:

```bash
# Development
vercel env add AWS_ACCESS_KEY_ID development
vercel env add AWS_SECRET_ACCESS_KEY development

# Preview (production credentials)
vercel env add AWS_ACCESS_KEY_ID preview
vercel env add AWS_SECRET_ACCESS_KEY preview

# Production
vercel env add AWS_ACCESS_KEY_ID production
vercel env add AWS_SECRET_ACCESS_KEY production
```

### 3. Update Convex Environment Variables

```bash
# Development
npx convex env set dev AWS_ACCESS_KEY_ID <NEW_KEY_ID>
npx convex env set dev AWS_SECRET_ACCESS_KEY <NEW_SECRET>

# Production
npx convex env set prod AWS_ACCESS_KEY_ID <NEW_KEY_ID>
npx convex env set prod AWS_SECRET_ACCESS_KEY <NEW_SECRET>
```

### 4. Redeploy

Trigger fresh deployments so the new credentials are picked up:

```bash
vercel deploy --prod      # Production
vercel deploy             # Preview/Development as needed
```

### 5. Deactivate Old Keys

After verifying successful deployments and artifact uploads, remove the previous key. Use the helper script with `--deactivate`, or run manually:

```bash
aws iam delete-access-key \
  --user-name anveio-post-artifacts-dev \
  --access-key-id <OLD_KEY_ID>

aws iam delete-access-key \
  --user-name anveio-post-artifacts-prod \
  --access-key-id <OLD_KEY_ID>
```

### 6. Record Rotation

Log the rotation in the engineering journal or ticketing system with:
- Date/time
- Operator
- Reason (scheduled rotation vs. incident response)
- Old key ID (for audit trail)

## Validation Checklist
- [ ] New keys saved in secure storage.
- [ ] Vercel environments updated.
- [ ] Convex environments updated.
- [ ] New deployments completed without errors.
- [ ] Old keys deactivated.
- [ ] Rotation recorded.
