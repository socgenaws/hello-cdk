import * as autoscaling from 'aws-cdk-lib/aws-autoscaling';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as cdk from 'aws-cdk-lib';


export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create a VPC
    const vpc = new ec2.Vpc(this, 'MyVpc', {
      maxAzs: 2, // Specify the desired number of Availability Zones
    });

    // Create a Network Load Balancer
    const nlb = new elbv2.NetworkLoadBalancer(this, 'MyNlb', {
      vpc,
      internetFacing: true, // Set to true if you want it to be internet-facing
    });

    // Create a listener for the NLB
    const listener = nlb.addListener('MyListener', {
      port: 80, // Set the desired port
    });

      // Create an Auto Scaling Group
      // const asg = new autoscaling.AutoScalingGroup(this, 'MyAsg', {
      //   vpc,
      //   instanceType: new ec2.InstanceType('t2.micro'), // Choose your instance type
      //   machineImage: new ec2.AmazonLinuxImage(), // Use Amazon Linux as the AMI
      // });
    const userData = ec2.UserData.forLinux();
    userData.addCommands(
      'sudo su',
      'yum install -y httpd',
      'systemctl start httpd',
      'systemctl enable httpd',
      'echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html',
    );

    const asg = new autoscaling.AutoScalingGroup(this, 'asg', {
        vpc,
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.BURSTABLE2,
          ec2.InstanceSize.MICRO,
        ),
        machineImage: new ec2.AmazonLinuxImage({
          generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
        }),
        userData,
        minCapacity: 2,
        maxCapacity: 3,
      });
    // Add the ASG as the target to the NLB listener
    listener.addTargets('AsgTarget', {
      targets: [asg],
      port: 80, // Set the port that the ASG instances are listening on
    });
  }
}