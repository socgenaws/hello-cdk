// import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import {BucketDeployment, Source} from "@aws-cdk/aws-s3-deployment";
import {Bucket, BucketAccessControl} from "@aws-cdk/aws-s3";
import * as path from "path";


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const bucket = new Bucket(this, 'MyTempFileBucketdddd250120241250', {
      accessControl: BucketAccessControl.PRIVATE,
    })

    new BucketDeployment(this, 'BucketDeployment', {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../website'))]
    })

    // const myBucket = new s3.Bucket(this, 'MyTempFileBucketdddd250120241250', {
    //   removalPolicy: cdk.RemovalPolicy.DESTROY,
    //   autoDeleteObjects: true,
    //   transferAcceleration: true,
    // });    
    // const deployment = new s3Deployment.BucketDeployment(
    //   this,
    //   'deployStaticWebsite',
    //   {
    //     sources: [s3Deployment.Source.asset('../website')],
    //     destinationBucket: myBucket,
    //   }
    // );
  }
}



