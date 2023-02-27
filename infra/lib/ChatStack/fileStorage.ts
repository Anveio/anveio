import { CfnOutput, RemovalPolicy, Stack, StackProps } from "aws-cdk-lib"
import { Construct } from "constructs"
import * as s3 from "aws-cdk-lib/aws-s3"
import * as iam from "aws-cdk-lib/aws-iam"

interface FileStorageStackProps extends StackProps {
	authenticatedRole: iam.IRole
	unauthenticatedRole: iam.IRole
	allowedOrigins: string[]
}

export class FileStorageStack extends Stack {
	bucket: s3.Bucket

	constructor(scope: Construct, id: string, props: FileStorageStackProps) {
		super(scope, id, props)

		this.bucket = new s3.Bucket(this, "s3-bucket", {
			removalPolicy: RemovalPolicy.DESTROY,
			autoDeleteObjects: true,
			cors: [
				{
					allowedMethods: [
						s3.HttpMethods.GET,
						s3.HttpMethods.POST,
						s3.HttpMethods.PUT,
						s3.HttpMethods.DELETE,
					],
					allowedOrigins: props.allowedOrigins,
					allowedHeaders: ["*"],
				},
			],
		})

		
	}
}
