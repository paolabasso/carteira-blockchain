import * as lambda from "aws-cdk-lib/aws-lambda"
import * as lambdaNodeJS from "aws-cdk-lib/aws-lambda-nodejs"
import * as cdk from "aws-cdk-lib"
import * as dynamodb from "aws-cdk-lib/aws-dynamodb"
import * as ssm from "aws-cdk-lib/aws-ssm"

import { Construct } from "constructs"

export class BlockchainWalletsAppStack extends cdk.Stack {
    readonly getBlockchainWalletsHandler: lambdaNodeJS.NodejsFunction
    readonly blockchainWalletsDB: dynamodb.Table
    readonly createBlockchainWalletHandler: lambdaNodeJS.NodejsFunction
    readonly updateBlockchainWalletHandler: lambdaNodeJS.NodejsFunction
    readonly deleteBlockchainWalletHandler: lambdaNodeJS.NodejsFunction

    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props)

        this.blockchainWalletsDB = new dynamodb.Table(this, "BlockchainWalletsDB", {
            tableName: "wallets",
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            partitionKey: {
                name: "id",
                type: dynamodb.AttributeType.STRING
            },
            billingMode: dynamodb.BillingMode.PROVISIONED,
            readCapacity: 1,
            writeCapacity: 1

        })

        const blockchainWalletsLayerArn = ssm.StringParameter.valueForStringParameter(this, "BlockchainWalletsLayerArn")
        const blockchainWalletsLayer = lambda.LayerVersion.fromLayerVersionArn(this, "BlockchainWalletsLayerArn", blockchainWalletsLayerArn)

        this.getBlockchainWalletsHandler = new lambdaNodeJS.NodejsFunction(this, "GetBlockchainWalletsFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            functionName: "GetBlockchainWalletsFunction",
            entry: "lambda/blockchainWallets/getBlockchainWalletsFunction.ts",
            handler: "handler",
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                BLOCKCHAIN_WALLETS_DB: this.blockchainWalletsDB.tableName
            },
            layers: [blockchainWalletsLayer]
        })
        this.blockchainWalletsDB.grantReadData(this.getBlockchainWalletsHandler)

        this.createBlockchainWalletHandler = new lambdaNodeJS.NodejsFunction(this, "CreateBlockchainWalletFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            functionName: "CreateBlockchainWalletFunction",
            entry: "lambda/blockchainWallets/createBlockchainWalletHandler.ts",
            handler: "handler",
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                BLOCKCHAIN_WALLETS_DB: this.blockchainWalletsDB.tableName
            },
            layers: [blockchainWalletsLayer]
        })

        this.blockchainWalletsDB.grantReadWriteData(this.createBlockchainWalletHandler)

        this.deleteBlockchainWalletHandler = new lambdaNodeJS.NodejsFunction(this, "DeleteBlockchainWalletFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            functionName: "DeleteBlockchainWalletFunction",
            entry: "lambda/blockchainWallets/deleteBlockchainWalletHandler.ts",
            handler: "handler",
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                BLOCKCHAIN_WALLETS_DB: this.blockchainWalletsDB.tableName
            },
            layers: [blockchainWalletsLayer]
        })

        this.blockchainWalletsDB.grantReadWriteData(this.deleteBlockchainWalletHandler)

        this.updateBlockchainWalletHandler = new lambdaNodeJS.NodejsFunction(this, "UpdateBlockchainWalletFunction", {
            runtime: lambda.Runtime.NODEJS_20_X,
            functionName: "UpdateBlockchainWalletFunction",
            entry: "lambda/blockchainWallets/updateBlockchainWalletHandler.ts",
            handler: "handler",
            memorySize: 512,
            timeout: cdk.Duration.seconds(5),
            bundling: {
                minify: true,
                sourceMap: false
            },
            environment: {
                BLOCKCHAIN_WALLETS_DB: this.blockchainWalletsDB.tableName
            },
            layers: [blockchainWalletsLayer]
        })

        this.blockchainWalletsDB.grantReadWriteData(this.updateBlockchainWalletHandler)
    }

}