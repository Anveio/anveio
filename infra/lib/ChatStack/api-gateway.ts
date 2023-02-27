import { GraphqlApi } from "@aws-cdk/aws-appsync-alpha"
import { Stack, StackProps } from "aws-cdk-lib"
import * as aws_api_gateway from "aws-cdk-lib/aws-apigateway"
import * as iam from "aws-cdk-lib/aws-iam"
import * as s3 from "aws-cdk-lib/aws-s3"
import { Construct } from "constructs"
import * as aws_lambda from "aws-cdk-lib/aws-lambda"

interface APIStackProps extends StackProps {
	bucket: s3.Bucket
	createUserLambda: aws_lambda.Function
}

export class ApiGatewayStack extends Stack {
	api: GraphqlApi
	constructor(scope: Construct, id: string, props: APIStackProps) {
		super(scope, id, props)

		const apiGateway = new aws_api_gateway.RestApi(this, "s3api")
		apiGateway.root.addMethod("GET")

		const usersResource = apiGateway.root.addResource("users")

        usersResource.addMethod

		const executeRole = new iam.Role(this, "role", {
			assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
			path: "/service-role/",
		})

		props.bucket.grantReadWrite(executeRole)

		const s3Integration = new aws_api_gateway.AwsIntegration({
			service: "s3",
			integrationHttpMethod: "PUT",
			path: "{bucket}",
			options: {
				credentialsRole: executeRole,
			},
		})

		apiGateway.root.addResource("{folder}").addMethod("PUT", s3Integration, {
			methodResponses: [
				{
					statusCode: "200",
				},
			],
		})
	}
}
