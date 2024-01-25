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
    const vpc = new ec2.Vpc(this, 'VPC'),
    const fileSystem = new efs.FileSystem(this, 'MyEfsFileSystem', {
      vpc,
      fileSystemPolicy: myFileSystemPolicy,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    fileSystem.addAccessPoint('AccessPoint');

    const instance = new ec2.Instance(this, 'ec2-instance', {
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      //role: webserverRole,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.BURSTABLE2,
        ec2.InstanceSize.MICRO,
      ),
      machineImage: new ec2.AmazonLinuxImage({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'virginia',
    });

    fileSystem.connections.allowDefaultPortFrom(instance);
    instance.userData.addCommands("yum check-update -y",    // Ubuntu: apt-get -y update
                                  "yum upgrade -y",                                 // Ubuntu: apt-get -y upgrade
                                  "yum install -y amazon-efs-utils",                // Ubuntu: apt-get -y install amazon-efs-utils
                                  "yum install -y nfs-utils",                       // Ubuntu: apt-get -y install nfs-common
                                  "file_system_id_1=" + fileSystem.fileSystemId,
                                  "efs_mount_point_1=/mnt/efs/fs1",
                                  "mkdir -p \"${efs_mount_point_1}\"",
                                  "test -f \"/sbin/mount.efs\" && echo \"${file_system_id_1}:/ ${efs_mount_point_1} efs defaults,_netdev\" >> /etc/fstab || " +
                                  "echo \"${file_system_id_1}.efs." + cdk.Stack.of(this).region + ".amazonaws.com:/ ${efs_mount_point_1} nfs4 nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport,_netdev 0 0\" >> /etc/fstab",
                                  "mount -a -t efs,nfs4 defaults");

  }
}