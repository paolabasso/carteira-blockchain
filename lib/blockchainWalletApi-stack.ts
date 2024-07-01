import * as cdk from "aws-cdk-lib"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as apiGateway from "aws-cdk-lib/aws-apigateway"
import * as cloudWatch from "aws-cdk-lib/aws-logs"

import { Construct } from "constructs"

interface blockchainWalletApiStackProps extends cdk.StackProps {
    getBlockchainWalletsHandler: lambdaNodeJS.NodejsFunction
    createBlockchainWalletHandler: lambdaNodeJS.NodejsFunction
    updateBlockchainWalletHandler: lambdaNodeJS.NodejsFunction
    deleteBlockchainWalletHandler: lambdaNodeJS.NodejsFunction
}

export class BlockchainWalletApiStack extends cdk.Stack {

    constructor(scope: Construct, id: string, props: blockchainWalletApiStackProps) {
        super(scope, id, props)

        const logGroup = new cloudWatch.LogGroup(this, "blockchainApiLogs")

        const api = new apiGateway.RestApi(this, "BlockchainWalletsApi", {
            restApiName: "BlockchainWalletsApi",
            cloudWatchRole: true,
            deployOptions: {
                accessLogDestination: new apiGateway.LogGroupLogDestination(logGroup),
                accessLogFormat: apiGateway.AccessLogFormat.jsonWithStandardFields({
                    httpMethod: true,
                    ip: true,
                    protocol: true,
                    requestTime: true,
                    resourcePath: true,
                    responseLength: true,
                    status: true,
                    caller: true,
                    user: true
                })
            }
        })

        const getBlockchainWalletsIntegration = new apiGateway.LambdaIntegration(props.getBlockchainWalletsHandler)

        const blockchainWalletsResource = api.root.addResource("wallets")

        blockchainWalletsResource.addMethod("GET", getBlockchainWalletsIntegration)
        const blockchainWalletIdResource = blockchainWalletsResource.addResource("{id}")
        blockchainWalletIdResource.addMethod("GET", getBlockchainWalletsIntegration)

        const createBlockchainWalletIntegration = new apiGateway.LambdaIntegration(props.createBlockchainWalletHandler)
        blockchainWalletsResource.addMethod("POST", createBlockchainWalletIntegration)

        const updateBlockchainWalletIntegration = new apiGateway.LambdaIntegration(props.updateBlockchainWalletHandler)
        blockchainWalletIdResource.addMethod("PUT", updateBlockchainWalletIntegration)

        const deleteBlockchainWalletIntegration = new apiGateway.LambdaIntegration(props.deleteBlockchainWalletHandler)
        blockchainWalletIdResource.addMethod("DELETE", deleteBlockchainWalletIntegration)
    }
}