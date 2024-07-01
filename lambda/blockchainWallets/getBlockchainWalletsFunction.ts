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

    if (event.resource === "/wallets") {
        const walletList = await blockchainWalletRepository.getAllBlockchainWallets()
        console.log('GET ALL SUCCESSFULLY')
        return {
            statusCode: 200,
            body: JSON.stringify(walletList)
        }
    }

    const walletId = event.pathParameters!.id as string
 
    try {
        const wallet = await blockchainWalletRepository.getBlockchainWalletById(walletId)
        console.log(`GET SUCCESSFULLY - ID: ${walletId}`)
        return {
            statusCode: 200,
            body: JSON.stringify(wallet)
        }
    } catch (error) {
        console.error((<Error>error).message)
        return {
            statusCode: 404,
            body: (<Error>error).message
        }
    }
}
