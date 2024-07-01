import * as Joi from "joi"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { BlockchainWalletRepository } from "/opt/nodejs/blockchainWalletsLayer"
import { DynamoDB } from "aws-sdk"

const blockchainWalletsDb = process.env.BLOCKCHAIN_WALLETS_DB!
const dbClient = new DynamoDB.DocumentClient()

const blockchainWalletRepository = new BlockchainWalletRepository(dbClient, blockchainWalletsDb)

export async function handler(event: APIGatewayProxyEvent,
    context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId = context.awsRequestId
    const gtwRequestId = event.requestContext.requestId

    console.log(`API Gateway RequestId: ${gtwRequestId} - Lambda RequestId: ${lambdaRequestId}`)
    const walletId = event.pathParameters!.id as string

    try {
        const walletDeleted = await blockchainWalletRepository.deleteBlockchainWallet(walletId)
        console.log(`DELETED SUCCESSFULLY - ID: ${walletId}`)
        return {
            statusCode: 200,
            body: JSON.stringify(walletDeleted)
        }
    } catch (error) {
        console.error((<Error>error).message)
        return {
            statusCode: 404,
            body: (<Error>error).message
        }
    }
}
