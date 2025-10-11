#!/usr/bin/env node
import 'source-map-support/register'

import { App } from 'aws-cdk-lib'
import { PostArtifactsStack } from '../lib/post-artifacts-stack'

const app = new App()

new PostArtifactsStack(app, 'AnveioPostArtifactsStack', {
  description:
    'Infrastructure for Anveio blog post artifacts (S3 storage + IAM access).',
})

app.synth()
