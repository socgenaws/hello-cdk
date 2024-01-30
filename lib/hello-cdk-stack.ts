import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as path from 'path';
import {BucketDeployment, Source} from "aws-cdk-lib/aws-s3-deployment"

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myBucket = new s3.Bucket(this, 'MyTempFileBucketdddd250120241250', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      transferAcceleration: true,
    });
    new BucketDeployment(this, "WebsiteDeployment", {
      sources: [Source.asset('../website')], // relative to the Stack dir
      destinationBucket: myBucket
  })
  }
}



