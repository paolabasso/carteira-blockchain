import { handler } from "../../../lambda/blockchainWallets/createBlockchainWalletFunction"
import { APIGatewayProxyEvent, Context } from "aws-lambda"
import {  BlockchainWalletRepository } from "/opt/nodejs/blockchainWalletsLayer"

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
            createBlockchainWallet: jest.fn(()=> resultSucess),
        };
    }),
}));


const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

describe("Create blockchain wallet data", () => {
    let mockEvent: APIGatewayProxyEvent
    let mockContext: Context
    let blockchainWalletRepositoryMock: jest.Mocked<BlockchainWalletRepository>

    beforeEach(() => {
        mockEvent = {
            body: JSON.stringify({
                walletName: "test_wallet_name",
                walletAddress: "test_address",
                privateKey: "test_private_key",
            }),
            requestContext: {
                requestId: "testRequestId",
            },
        } as any;

        mockContext = {
            awsRequestId: "testAwsRequestId",
        } as any

        blockchainWalletRepositoryMock = new BlockchainWalletRepository(null as any, '') as jest.Mocked<BlockchainWalletRepository>
    })

    it("Should successfully create a blockchain wallet", async () => {
        blockchainWalletRepositoryMock.createBlockchainWallet.mockResolvedValue({
            id: "12345",
            walletName: "test_wallet",
            walletAddress: "test_address",
            privateKey: "test_private_key",
            createdAt: "2024-06-05T14:48:00.000Z",
            updatedAt: "2024-06-05T14:48:00.000Z",
        })

        const response = await handler(mockEvent, mockContext)


        expect(response.statusCode).toBe(201)
        expect(response.body).toBe(JSON.stringify({            
            id: "12345",
            walletName: "test_wallet",
            walletAddress: "test_address",
            privateKey: "test_private_key",
            createdAt: "2024-06-05T14:48:00.000Z",
            updatedAt: "2024-06-05T14:48:00.000Z"}))
        
        expect(logSpy).toHaveBeenCalled();
    })

    it("should return a 400 error for invalid input", async () => {
        mockEvent.body = JSON.stringify({
            walletName: "test_wallet",
            walletAddress: "test_address"
        });

        const response = await handler(mockEvent, mockContext);

        expect(response.statusCode).toBe(400)
        expect(response.body).toMatch(/\"privateKey\" is required/);
        expect(errorSpy).toHaveBeenCalled()
    })

})