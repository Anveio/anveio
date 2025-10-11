import { describe, it } from 'vitest';
import { App } from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { PostArtifactsStack } from '../lib/post-artifacts-stack';

describe('PostArtifactsStack', () => {
  it('creates dev and prod artifact buckets with strict security defaults', () => {
    const app = new App();
    const stack = new PostArtifactsStack(app, 'TestStack');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::S3::Bucket', 2);

    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: Match.objectLike({
        'Fn::Join': Match.arrayWith([
          '',
          Match.arrayWith(['anveio-post-artifacts-dev-'])
        ])
      }),
      VersioningConfiguration: { Status: 'Enabled' },
      PublicAccessBlockConfiguration: {
        BlockPublicAcls: true,
        BlockPublicPolicy: true,
        IgnorePublicAcls: true,
        RestrictPublicBuckets: true
      }
    });

    template.hasResourceProperties('AWS::S3::Bucket', {
      BucketName: Match.objectLike({
        'Fn::Join': Match.arrayWith([
          '',
          Match.arrayWith(['anveio-post-artifacts-prod-'])
        ])
      })
    });
  });

  it('attaches scoped IAM policies for dev and prod users', () => {
    const app = new App();
    const stack = new PostArtifactsStack(app, 'PolicyStack');

    const template = Template.fromStack(stack);

    template.resourceCountIs('AWS::IAM::User', 2);

    template.hasResourceProperties('AWS::IAM::User', {
      UserName: 'anveio-post-artifacts-dev'
    });

    template.hasResourceProperties('AWS::IAM::User', {
      UserName: 'anveio-post-artifacts-prod'
    });

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Action: 's3:ListBucket',
            Effect: 'Allow'
          }),
          Match.objectLike({
            Action: ['s3:GetObject', 's3:PutObject', 's3:DeleteObject'],
            Effect: 'Allow'
          })
        ])
      }
    });
  });
});
