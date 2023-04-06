import * as aws_api_gateway from "aws-cdk-lib/aws-apigateway"
import * as iam from "aws-cdk-lib/aws-iam"
import { Construct } from "constructs"
import * as aws_lambda from "aws-cdk-lib/aws-lambda"
import * as path from "path"
import {
	CfnOutput,
	Expiration,
	RemovalPolicy,
	Stack,
	StackProps,
} from "aws-cdk-lib"
import * as aws_dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as aws_cognito from "aws-cdk-lib/aws-cognito"
import * as aws_cognito_alpha from "@aws-cdk/aws-cognito-identitypool-alpha"

import * as z from "zod"

import * as dotenv from "dotenv"

export class BackendStack extends Stack {
	constructor(scope: Construct, id: string, props: {}) {
		super(scope, id, props)

		const userTable = new aws_dynamodb.Table(this, "UserTable", {
			removalPolicy: RemovalPolicy.DESTROY,
			billingMode: aws_dynamodb.BillingMode.PAY_PER_REQUEST,
			partitionKey: { name: "id", type: aws_dynamodb.AttributeType.STRING },
		})

		const postSignupAddUserFunc = new aws_lambda.Function(
			this,
			"postConfirmTriggerFunc",
			{
				runtime: aws_lambda.Runtime.NODEJS_18_X,
				handler: "addUserToDB.main",
				code: aws_lambda.Code.fromAsset(
					path.join(__dirname, "functions/v1/postConfirmTrigger"),
				),
				environment: {
					TABLENAME: userTable.tableName,
				},
			},
		)

		userTable.grantWriteData(postSignupAddUserFunc)

		const userPool = new aws_cognito.UserPool(this, `ChatUserPool`, {
			selfSignUpEnabled: true,
			removalPolicy: RemovalPolicy.DESTROY,
			accountRecovery: aws_cognito.AccountRecovery.PHONE_AND_EMAIL,
			userVerification: {
				emailStyle: aws_cognito.VerificationEmailStyle.CODE,
			},
			autoVerify: {
				email: true,
			},
			standardAttributes: {
				email: {
					required: true,
					mutable: true,
				},
				preferredUsername: {
					required: false,
					mutable: true,
				},
			},
			lambdaTriggers: {
				postConfirmation: postSignupAddUserFunc,
			},
		})

		const userPoolClient = new aws_cognito.UserPoolClient(
			this,
			`ChatUserPoolClient`,
			{
				userPool,
			},
		)

		const signupUserFunction = new aws_lambda.Function(
			this,
			"signupUserFunction",
			{
				runtime: aws_lambda.Runtime.NODEJS_18_X,
				handler: "signupUser.main",
				code: aws_lambda.Code.fromAsset(
					path.join(__dirname, "functions/v1/auth"),
				),
				environment: {
					CLIENT_ID: userPoolClient.userPoolClientId,
					REGION: userPoolClient.stack.region,
				},
			},
		)

		const identityPool = new aws_cognito_alpha.IdentityPool(
			this,
			`ChatIdentityPool`,
			{
				identityPoolName: `ChatIdentityPool`,
				allowUnauthenticatedIdentities: true,
				authenticationProviders: {
					userPools: [
						new aws_cognito_alpha.UserPoolAuthenticationProvider({
							userPool,
							userPoolClient,
						}),
					],
				},
			},
		)

		const identityPoolId = new CfnOutput(this, "IdentityPoolId", {
			value: identityPool.identityPoolId,
		})

		const userPoolId = new CfnOutput(this, "UserPoolId", {
			value: userPool.userPoolId,
		})

		const userPoolClientId = new CfnOutput(this, "UserPoolClientId", {
			value: userPoolClient.userPoolClientId,
		})

		const apiGateway = new aws_api_gateway.RestApi(this, "BackendApi_v1", {
			restApiName: "v1",
		})
		const usersResource = apiGateway.root.addResource("users")

		usersResource.addMethod(
			"POST",
			new aws_api_gateway.LambdaIntegration(signupUserFunction),
		)
	}
}
