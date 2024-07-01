import * as lambda from "aws-cdk-lib/aws-lambda"
import * as cdk from "aws-cdk-lib"
import { Construct } from "constructs"
import * as ssm from "aws-cdk-lib/aws-ssm"


export class BlockchainWalletsAppLayersStack extends cdk.Stack {
    readonly blockchainWalletsLayers: lambda.LayerVersion

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)
        this.blockchainWalletsLayers = new lambda.LayerVersion(this, "BlockchainWalletsLayer", {
            code: lambda.Code.fromAsset('lambda/blockchainWallets/layers/blockchainWalletsLayer'),
            compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
            layerVersionName: "BlockchainWalletsLayer",
            removalPolicy: cdk.RemovalPolicy.RETAIN
        })
        new ssm.StringParameter(this, "BlockchainWalletsLayerArn", {
            parameterName: "BlockchainWalletsLayerArn",
            stringValue: this.blockchainWalletsLayers.layerVersionArn
        })
    }
}