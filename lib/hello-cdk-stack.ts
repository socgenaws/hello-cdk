// import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
export class HelloCdkStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      // The pipeline name
      pipelineName: 'MyServicePipeline',

       // How it will be built and synthesized
       synth: new ShellStep('Synth', {
         // Where the source can be found
         input: CodePipelineSource.gitHub('OWNER/REPO', 'main'),
         
         // Install dependencies, build and run cdk synth
         installCommands: ['npm i -g npm@latest'],
         commands: [
           'npm ci',
           'npm run build',
           'npx cdk synth'
         ],
       }),
    });

    // This is where we add the application stages
    // For environment with default values 
    // const deploy = new CdkEBStage(this, 'Pre-Prod');

    // For environment with custom AutoScaling group configuration
    const deploy = new CdkEBStage(this, 'Pre-Prod', { 
      minSize : "1",
      maxSize : "1"
  });
    const deployStage = pipeline.addStage(deploy); 
  }
}



