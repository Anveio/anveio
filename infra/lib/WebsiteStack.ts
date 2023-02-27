import { RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import * as aws_ec2 from "aws-cdk-lib/aws-ec2"
import * as aws_ecs from "aws-cdk-lib/aws-ecs"
import * as aws_ecr from "aws-cdk-lib/aws-ecr"
import * as aws_ecs_pattersn from "aws-cdk-lib/aws-ecs-patterns"
import { Construct } from "constructs"
import * as path from "path"
import * as z from "zod"
import * as dotenv from "dotenv"

export class WebsiteStack extends Stack {
	constructor(scope: Construct, id: string, props: StackProps) {
		super(scope, id, props)

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

		const { WEBSITE_OPEN_PORT } = env

		// The code that defines your stack goes here

		const vpc = new aws_ec2.Vpc(this, "MyVpc", {
			maxAzs: 3, // Default is all AZs in region
		})

		const cluster = new aws_ecs.Cluster(this, "MyCluster", {
			vpc: vpc,
		})

		const websiteImage = aws_ecs.ContainerImage.fromAsset(
			path.join(__dirname, "..", "..", "..", ".."),
		)

		const loadBalancedFargateService =
			new aws_ecs_pattersn.ApplicationLoadBalancedFargateService(
				this,
				"NextJsFargateService",
				{
					cluster,
					memoryLimitMiB: 1024,
					cpu: 512,
					desiredCount: 1,
					taskImageOptions: {
						image: websiteImage,
						containerPort: Number(WEBSITE_OPEN_PORT),
					},
					publicLoadBalancer: true, // Default is false
				},
			)
	}
}
