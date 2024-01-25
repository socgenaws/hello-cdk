import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as efs from 'aws-cdk-lib/aws-efs';
import * as cdk from 'aws-cdk-lib';


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const myFileSystemPolicy = new iam.PolicyDocument({
      statements: [new iam.PolicyStatement({
        actions: [
          'elasticfilesystem:ClientWrite',
          'elasticfilesystem:ClientMount',
        ],
        principals: [new iam.AccountRootPrincipal()],
        resources: ['*'],
        conditions: {
          Bool: {
            'elasticfilesystem:AccessedViaMountTarget': 'true',
          },
        },
      })],
    });
    
    const fileSystem = new efs.FileSystem(this, 'MyEfsFileSystem', {
      vpc: new ec2.Vpc(this, 'VPC'),
      fileSystemPolicy: myFileSystemPolicy,
    });

    fileSystem.addAccessPoint('AccessPoint');

  }
}