import { Stack } from "aws-cdk-lib"
import * as ec2 from "aws-cdk-lib/aws-ec2"
import { DockerImageAsset } from "aws-cdk-lib/aws-ecr-assets"
import * as ecs from "aws-cdk-lib/aws-ecs"
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns"
import { Construct } from "constructs"

export class WebStack extends Stack {
	constructor(scope: Construct, id: string, props: {}) {
		super(scope, id, props)

		const APP_PORT = 3000

		const pathToDockerFile = "../../../../web"

		const vpc = new ec2.Vpc(this, "MyVpc", {
			maxAzs: 2,
		})

		const taskDefinition = new ecs.FargateTaskDefinition(
			this,
			"MyTaskDefinition",
			{
				memoryLimitMiB: 512,
				cpu: 256,
			},
		)

		const dockerFile = new DockerImageAsset(this, "DockerFileAsset", {
			directory: pathToDockerFile,
			file: "Dockerfile",
		})

		const image = ecs.ContainerImage.fromDockerImageAsset(dockerFile)

		const container = taskDefinition.addContainer("MyContainer", {
			image,
			// store the logs in cloudwatch
			logging: ecs.LogDriver.awsLogs({ streamPrefix: "myexample-logs" }),
		})

		container.addPortMappings({
			containerPort: APP_PORT,
		})

		const cluster = new ecs.Cluster(this, "MyECSCluster", {
			clusterName: "MyECSCluster",
			containerInsights: true,
			vpc,
		})

		const securityGroup = new ec2.SecurityGroup(this, `My-security-group`, {
			vpc: vpc,
			allowAllOutbound: true,
			description: "My Security Group",
		})

		securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(APP_PORT))

		const fargateService =
			new ecs_patterns.ApplicationLoadBalancedFargateService(
				this,
				"MyFargateService",
				{
					cluster,
					publicLoadBalancer: true,
					cpu: 256,
					desiredCount: 1,
					memoryLimitMiB: 512,
					taskDefinition,
					securityGroups: [securityGroup],
				},
			)

		const scalableTarget = fargateService.service.autoScaleTaskCount({
			minCapacity: 1,
			maxCapacity: 2,
		})

		scalableTarget.scaleOnCpuUtilization("cpuScaling", {
			targetUtilizationPercent: 70,
		})
	}
}
