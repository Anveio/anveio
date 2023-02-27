import { Stack, Stage, StageProps } from "aws-cdk-lib"
import * as aws_ec2 from "aws-cdk-lib/aws-ec2"
import * as aws_ecs from "aws-cdk-lib/aws-ecs"
import * as aws_pipelines from "aws-cdk-lib/pipelines"
import { Construct } from "constructs"
import * as aws_iam from "aws-cdk-lib/aws-iam"
import * as ecr from "aws-cdk-lib/aws-ecr"
import * as aws_codebuild from "aws-cdk-lib/aws-codebuild"
import * as aws_secretsmanager from "aws-cdk-lib/aws-secretsmanager"
import * as dotenv from "dotenv"
import * as path from "path"
import * as z from "zod"
import { WebsiteStack } from "./WebsiteStack"
import { BackendStack } from "./BackendStack"

export class GitHubContinuousIntegrationStack extends Stack {
	pipeline: aws_pipelines.CodePipeline;
	constructor(scope: Construct, id: string, props: {}) {
		super(scope, id, props)
		/**
		 * THE WEBSITE
		 */
		const envSchema = z.object({
			GITHUB_ORG_OR_USERNAME: z.string(),
			GITHUB_REPO_NAME: z.string(),
			GITHUB_TRUNK_BRANCH_NAME: z.string(),
			WEBSITE_OPEN_PORT: z.string(),
		})

		dotenv.config({
			path: path.join(__dirname, "..", "..", "..", "..", "business.env"),
		})

		const env = envSchema.parse(process.env)

		const {
			GITHUB_ORG_OR_USERNAME,
			GITHUB_REPO_NAME,
			GITHUB_TRUNK_BRANCH_NAME,
			WEBSITE_OPEN_PORT,
		} = env

		const githubDeployAccessSecret = aws_secretsmanager.Secret.fromSecretNameV2(
			this,
			"GitHubAccessToken",
			`PwettyGitHubToken`,
		)

		new aws_codebuild.GitHubSourceCredentials(this, "CodeBuildGitHubCreds", {
			accessToken: githubDeployAccessSecret.secretValue,
		})

		this.pipeline = new aws_pipelines.CodePipeline(this, "CodePipeline", {
			pipelineName: "PwettyMedia",
			synth: new aws_pipelines.ShellStep("SynthesizeInfrastructureAsCode", {
				input: aws_pipelines.CodePipelineSource.gitHub(
					`${GITHUB_ORG_OR_USERNAME}/${GITHUB_REPO_NAME}`,
					`${GITHUB_TRUNK_BRANCH_NAME}`,
					{
						authentication: githubDeployAccessSecret.secretValue,
					},
				),
				primaryOutputDirectory: "apps/infra/cdk.out",
				commands: [
					/**
					 * $TODO: until AWS CodeBuild supports at least Node 16,
					 * we cannot use any monorepo features or turborepo.
					 */
					"cd apps/infra",
					"npm i",
					"npm run build",
					"$(npm bin)/cdk synth --all",
				],
			}),
		})

		class BackendStage extends Stage {
			constructor(scope: Construct, id: string, props?: StageProps) {
				super(scope, id, props)
				new BackendStack(this, "BackendStack", {})
			}
		}

		class FrontendStage extends Stage {
			constructor(scope: Construct, id: string, props?: StageProps) {
				super(scope, id, props)

				new WebsiteStack(this, "WebsiteStack", {})
			}
		}

		
	}
}
