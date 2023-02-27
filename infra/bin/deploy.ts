#!/usr/bin/env node

import "source-map-support/register"
import * as cdk from "aws-cdk-lib"
import { BackendStack, GitHubContinuousIntegrationStack } from "../lib"

import * as dotenv from "dotenv"

import * as path from "path"

dotenv.config({
	path: path.join(__dirname, "..", "..", "..", "business.env"),
})

const app = new cdk.App()

new GitHubContinuousIntegrationStack(
	app,
	"GithubContinuousIntegrationStack",
	{},
)

app.synth()
