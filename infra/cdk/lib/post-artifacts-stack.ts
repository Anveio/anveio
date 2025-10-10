import {
  Aws,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  type StackProps,
} from 'aws-cdk-lib'
import { Effect, Policy, PolicyStatement, User } from 'aws-cdk-lib/aws-iam'
import {
  BlockPublicAccess,
  Bucket,
  BucketEncryption,
  type LifecycleRule,
  StorageClass,
} from 'aws-cdk-lib/aws-s3'
import type { Construct } from 'constructs'

type ArtifactEnvironment = 'dev' | 'prod'

const ARTIFACT_OBJECT_PREFIX = 'posts/'

interface ArtifactResourceConfig {
  readonly env: ArtifactEnvironment
  readonly logicalPrefix: string
}

const ENV_CONFIGS: ArtifactResourceConfig[] = [
  { env: 'dev', logicalPrefix: 'DevArtifacts' },
  { env: 'prod', logicalPrefix: 'ProdArtifacts' },
]

export class PostArtifactsStack extends Stack {
  public constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props)

    ENV_CONFIGS.forEach((config) => {
      const bucket = this.createArtifactsBucket(config)
      const user = this.createArtifactsUser(config, bucket)

      new CfnOutput(this, `${config.logicalPrefix}BucketName`, {
        value: bucket.bucketName,
        exportName: `AnveioPostArtifacts${config.env.charAt(0).toUpperCase()}${config.env.slice(1)}BucketName`,
        description: `S3 bucket for ${config.env} post artifacts`,
      })

      new CfnOutput(this, `${config.logicalPrefix}UserName`, {
        value: user.userName,
        exportName: `AnveioPostArtifacts${config.env.charAt(0).toUpperCase()}${config.env.slice(1)}UserName`,
        description: `IAM user with scoped access to the ${config.env} artifacts bucket`,
      })
    })
  }

  private createArtifactsBucket(config: ArtifactResourceConfig): Bucket {
    const lifecycleRules: LifecycleRule[] = [
      {
        noncurrentVersionTransitions: [
          {
            storageClass: StorageClass.GLACIER,
            transitionAfter: Duration.days(90),
          },
        ],
      },
    ]

    return new Bucket(this, `${config.logicalPrefix}Bucket`, {
      bucketName: `anveio-post-artifacts-${config.env}-${Aws.ACCOUNT_ID}`,
      encryption: BucketEncryption.S3_MANAGED,
      enforceSSL: true,
      versioned: true,
      blockPublicAccess: BlockPublicAccess.BLOCK_ALL,
      lifecycleRules,
      removalPolicy: RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
    })
  }

  private createArtifactsUser(
    config: ArtifactResourceConfig,
    bucket: Bucket,
  ): User {
    const user = new User(this, `${config.logicalPrefix}User`, {
      userName: `anveio-post-artifacts-${config.env}`,
    })

    const listStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:ListBucket'],
      resources: [bucket.bucketArn],
      conditions: {
        StringLike: {
          's3:prefix': [
            `${ARTIFACT_OBJECT_PREFIX}`,
            `${ARTIFACT_OBJECT_PREFIX}*`,
          ],
        },
      },
    })

    const objectCrudStatement = new PolicyStatement({
      effect: Effect.ALLOW,
      actions: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
      resources: [bucket.arnForObjects(`${ARTIFACT_OBJECT_PREFIX}*`)],
    })

    const policy = new Policy(this, `${config.logicalPrefix}AccessPolicy`, {
      statements: [listStatement, objectCrudStatement],
    })

    user.attachInlinePolicy(policy)

    return user
  }
}
