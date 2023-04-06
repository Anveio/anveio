import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Duration, Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";

export class AwsCdkDynamodbStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const table = new dynamodb.Table(this, "Table", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    });
  }
}
