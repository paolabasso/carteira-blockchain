import { handler } from "../../../lambda/blockchainWallets/deleteBlockchainWalletFunction"
import { APIGatewayProxyEvent, Context } from "aws-lambda"
import { BlockchainWallet, BlockchainWalletRepository } from "/opt/nodejs/blockchainWalletsLayer"

const resultSucess = {
    id: "12345",
    walletName: "test_wallet",
    walletAddress: "test_address",
    privateKey: "test_private_key",
    createdAt: "2024-06-05T14:48:00.000Z",
    updatedAt: "2024-06-05T14:48:00.000Z",
}

jest.mock("/opt/nodejs/blockchainWalletsLayer", () => ({
    BlockchainWalletRepository: jest.fn().mockImplementation(() => {
        return {
            deleteBlockchainWallet: jest.fn(() => resultSucess ),
        }
    }),
}));


const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { })

describe("Delete blockchain wallet data", () => {
    let mockEvent: APIGatewayProxyEvent
    let mockContext: Context
    let blockchainWalletRepositoryMock: jest.Mocked<BlockchainWalletRepository>

    beforeEach(() => {
        mockEvent = {
            requestContext: {
                requestId: "testRequestId",
            },
            pathParameters: { id: "1223" }
        } as any;

        mockContext = {
            awsRequestId: "testAwsRequestId",
        } as any

        blockchainWalletRepositoryMock = new BlockchainWalletRepository(null as any, '') as jest.Mocked<BlockchainWalletRepository>
    })

    it("Should successfully delete a blockchain wallet", async () => {
        blockchainWalletRepositoryMock.deleteBlockchainWallet.mockResolvedValue(resultSucess)
        
        const response = await handler(mockEvent, mockContext)

        expect(response.statusCode).toBe(200)
        expect(response.body).toBe(JSON.stringify({            
            id: "12345",
            walletName: "test_wallet",
            walletAddress: "test_address",
            privateKey: "test_private_key",
            createdAt: "2024-06-05T14:48:00.000Z",
            updatedAt: "2024-06-05T14:48:00.000Z"}))

        expect(logSpy).toHaveBeenCalled()
    }) 
})