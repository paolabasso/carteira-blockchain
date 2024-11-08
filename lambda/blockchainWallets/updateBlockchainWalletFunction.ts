import * as Joi from "joi"
import { APIGatewayProxyEvent, APIGatewayProxyResult, Context } from "aws-lambda"
import { BlockchainWallet, BlockchainWalletRepository } from "/opt/nodejs/blockchainWalletsLayer"
import { DynamoDB } from "aws-sdk"

const blockchainWalletsDb = process.env.BLOCKCHAIN_WALLETS_DB!
const dbClient = new DynamoDB.DocumentClient()

const blockchainWalletRepository = new BlockchainWalletRepository(dbClient, blockchainWalletsDb)


const schema = Joi.object({
    walletName: Joi.string().required(),
    walletAddress: Joi.string().required(),
    privateKey: Joi.string().required(),
})

export async function handler(event: APIGatewayProxyEvent,
    context: Context): Promise<APIGatewayProxyResult> {

    const lambdaRequestId = context.awsRequestId
    const gtwRequestId = event.requestContext.requestId

    console.log(`API Gateway RequestId: ${gtwRequestId} - Lambda RequestId: ${lambdaRequestId}`)

    const walletId = event.pathParameters!.id as string
    const walletData = JSON.parse(event.body!) as BlockchainWallet
    console.log(`PUT - DATA: ${JSON.stringify(walletData)}`)
    try {
        const { value, error } = schema.validate(walletData)
        if (!error) {
            const walletUpdated = await blockchainWalletRepository.updateBlockchainWallet(walletId, value)
            console.log(`UPDATE SUCCESSFULLY - ID: ${walletId}`)
            return {
                statusCode: 201,
                body: JSON.stringify(walletUpdated)
            }
        }
        throw error
    } catch (error) {
        console.error((<Error>error).message)
        return {
            statusCode: 400,
            body: (<Error>error).message
        }
    }
}
